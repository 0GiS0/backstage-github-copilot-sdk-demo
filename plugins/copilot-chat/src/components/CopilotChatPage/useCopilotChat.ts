import { useState, useRef, useCallback, useEffect } from 'react';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { discoveryApiRef } from '@backstage/core-plugin-api';
import { ChatMessage } from './types';

export interface CopilotModel {
  id: string;
  name: string;
  premiumRequests: number;
}

let messageCounter = 0;
function createId() {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

export function useCopilotChat() {
  const githubAuthApi = useApi(githubAuthApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>();
  const [models, setModels] = useState<CopilotModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4.1');
  const [modelsLoading, setModelsLoading] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    githubAuthApi
      .getProfile({ optional: true })
      .then(profile => {
        if (profile?.picture) setUserAvatarUrl(profile.picture);
      })
      .catch(() => {});
  }, [githubAuthApi]);

  // Fetch available models on mount
  useEffect(() => {
    let cancelled = false;
    async function loadModels() {
      setModelsLoading(true);
      try {
        const githubToken = await githubAuthApi.getAccessToken(['read:user']);
        const baseUrl = await discoveryApi.getBaseUrl('copilot-chat');
        const response = await fetch(`${baseUrl}/models`, {
          headers: { 'X-GitHub-Token': githubToken },
        });
        if (response.ok) {
          const data: CopilotModel[] = await response.json();
          if (!cancelled) {
            setModels(data);
            // Default to gpt-4.1 if available
            const defaultModel = data.find(m => m.id === 'gpt-4.1');
            if (defaultModel) {
              setSelectedModel(defaultModel.id);
            } else if (data.length > 0) {
              setSelectedModel(data[0].id);
            }
          }
        }
      } catch {
        // models will remain empty — selector won't show
      } finally {
        if (!cancelled) setModelsLoading(false);
      }
    }
    loadModels();
    return () => {
      cancelled = true;
    };
  }, [githubAuthApi, discoveryApi]);

  // When model changes, reset session so next message uses the new model
  const changeModel = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    sessionIdRef.current = null;
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      // Add user message immediately
      const userMsg: ChatMessage = {
        id: createId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      // Prepare a placeholder assistant message that we'll stream into
      const assistantId = createId();
      setMessages(prev => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      try {
        // Get the user's real GitHub OAuth token
        const githubToken = await githubAuthApi.getAccessToken(['read:user']);

        // Discover the backend plugin base URL
        const baseUrl = await discoveryApi.getBaseUrl('copilot-chat');

        // Call the backend chat endpoint via SSE
        const response = await fetch(`${baseUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-GitHub-Token': githubToken,
          },
          body: JSON.stringify({
            message: text,
            sessionId: sessionIdRef.current,
            model: selectedModel,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === 'session') {
                sessionIdRef.current = event.sessionId;
              } else if (event.type === 'delta') {
                // Append delta to the assistant message
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantId
                      ? { ...msg, content: msg.content + event.content }
                      : msg,
                  ),
                );
              } else if (event.type === 'error') {
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantId
                      ? {
                          ...msg,
                          content: `Error: ${event.error}`,
                        }
                      : msg,
                  ),
                );
                if (event.resetSession) {
                  sessionIdRef.current = null;
                }
              }
              // type === 'done' — nothing extra needed
            } catch {
              // ignore malformed JSON
            }
          }
        }
      } catch (err: any) {
        // Update the assistant placeholder with the error
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: `Sorry, something went wrong: ${err.message}`,
                }
              : msg,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [githubAuthApi, discoveryApi, selectedModel],
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    sessionIdRef.current = null;
  }, []);

  return {
    messages,
    isLoading,
    handleSend,
    handleClear,
    userAvatarUrl,
    models,
    selectedModel,
    changeModel,
    modelsLoading,
  };
}

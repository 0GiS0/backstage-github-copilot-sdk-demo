import { useState, useRef, useCallback } from 'react';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { discoveryApiRef } from '@backstage/core-plugin-api';
import { ChatMessage } from './types';

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
  const sessionIdRef = useRef<string | null>(null);

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
    [githubAuthApi, discoveryApi],
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    sessionIdRef.current = null;
  }, []);

  return { messages, isLoading, handleSend, handleClear };
}

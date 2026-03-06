import { useState, useRef, useCallback, useEffect } from 'react';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { discoveryApiRef } from '@backstage/core-plugin-api';
import { ChatMessage, ChatProgressEvent, ChatProgressStep } from './types';

export interface CopilotModel {
  id: string;
  name: string;
  premiumRequests: number;
}

const DEFAULT_MODEL_ID = 'claude-opus-4.5';

let messageCounter = 0;
function createId() {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

function getProgressCopy(event: ChatProgressEvent): {
  key: string;
  label: string;
  status: ChatProgressStep['status'];
} | null {
  if (event.key && event.label && event.status) {
    return {
      key: event.key,
      label: event.label,
      status: event.status,
    };
  }

  if (event.tool) {
    return {
      key: `tool:${event.tool}`,
      label: event.tool,
      status:
        event.action === 'tool_start'
          ? 'running'
          : event.success === false
          ? 'failed'
          : 'completed',
    };
  }

  if (event.agent) {
    return {
      key: `agent:${event.agent}`,
      label: event.agent,
      status: event.action === 'agent_start' ? 'running' : 'completed',
    };
  }

  return null;
}

function getProgressLabel(event: ChatProgressEvent): string | null {
  if (event.action === 'tool_end' && event.success !== false) {
    return null;
  }

  return getProgressCopy(event)?.label || null;
}

export function useCopilotChat() {
  const githubAuthApi = useApi(githubAuthApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>();
  const [models, setModels] = useState<CopilotModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [toolAction, setToolAction] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ChatProgressStep[]>([]);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    githubAuthApi
      .getProfile({ optional: true })
      .then(profile => {
        if (profile?.picture) {
          setUserAvatarUrl(profile.picture);
        }
      })
      .catch(() => {});
  }, [githubAuthApi]);

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

        if (!response.ok) {
          return;
        }

        const data: CopilotModel[] = await response.json();

        if (cancelled) {
          return;
        }

        setModels(data);

        const defaultModel =
          data.find(model => model.id === DEFAULT_MODEL_ID) ||
          data.find(model => /claude.*opus.*4\.5/i.test(model.name));

        if (defaultModel) {
          setSelectedModel(defaultModel.id);
        } else if (data.length > 0) {
          setSelectedModel(data[0].id);
        }
      } catch {
        // models remain empty and the selector stays hidden
      } finally {
        if (!cancelled) {
          setModelsLoading(false);
        }
      }
    }

    loadModels();

    return () => {
      cancelled = true;
    };
  }, [githubAuthApi, discoveryApi]);

  const changeModel = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    sessionIdRef.current = null;
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      let hasReceivedDelta = false;
      let showingSyntheticProgress = false;

      const userMsg: ChatMessage = {
        id: createId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      setToolAction(null);
      setProgressSteps([]);

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
        const githubToken = await githubAuthApi.getAccessToken(['read:user']);
        const baseUrl = await discoveryApi.getBaseUrl('copilot-chat');

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
            currentUrl: window.location.href,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let streamOpen = true;

        while (streamOpen) {
          const { done, value } = await reader.read();
          if (done) {
            streamOpen = false;
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) {
              continue;
            }

            const jsonStr = line.slice(6).trim();
            if (!jsonStr) {
              continue;
            }

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === 'session') {
                sessionIdRef.current = event.sessionId;
              } else if (event.type === 'delta') {
                hasReceivedDelta = true;
                setToolAction(null);
                const replaceSyntheticProgress = showingSyntheticProgress;

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantId
                      ? {
                          ...msg,
                          content: replaceSyntheticProgress
                            ? event.content
                            : msg.content + event.content,
                        }
                      : msg,
                  ),
                );

                showingSyntheticProgress = false;
              } else if (event.type === 'progress') {
                const progressEvent = event as ChatProgressEvent;
                const label = getProgressLabel(progressEvent);
                const progressCopy = getProgressCopy(progressEvent);

                if (!progressCopy) {
                  continue;
                }

                setToolAction(label);
                setProgressSteps(prev => {
                  const existingIndex = prev.findIndex(
                    step => step.key === progressCopy.key,
                  );

                  if (existingIndex === -1) {
                    return [
                      ...prev,
                      {
                        id: createId(),
                        key: progressCopy.key,
                        label: progressCopy.label,
                        status: progressCopy.status,
                      },
                    ];
                  }

                  return prev.map((step, index) =>
                    index === existingIndex
                      ? {
                          ...step,
                          label: progressCopy.label,
                          status: progressCopy.status,
                        }
                      : step,
                  );
                });

                if (label && !hasReceivedDelta) {
                  showingSyntheticProgress = true;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantId
                        ? {
                            ...msg,
                            content: label,
                          }
                        : msg,
                    ),
                  );
                }
              } else if (event.type === 'done') {
                setToolAction(null);
                setProgressSteps([]);
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

                setToolAction(null);
                setProgressSteps([]);
              }
            } catch {
              // ignore malformed JSON
            }
          }
        }
      } catch (err: any) {
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
        setToolAction(null);
      } finally {
        setIsLoading(false);
        setToolAction(null);
      }
    },
    [githubAuthApi, discoveryApi, selectedModel],
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setToolAction(null);
    setProgressSteps([]);
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
    toolAction,
    progressSteps,
  };
}

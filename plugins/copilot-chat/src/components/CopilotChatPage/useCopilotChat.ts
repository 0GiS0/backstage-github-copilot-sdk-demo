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

const TOOL_PROGRESS_COPY: Record<
  string,
  { start: string; success: string; error: string }
> = {
  backstage_list_templates: {
    start: '📋 Listando plantillas...',
    success: '📋 Plantillas listadas',
    error: '❌ Error al listar plantillas',
  },
  backstage_get_template_details: {
    start: '🧩 Revisando parámetros de la plantilla...',
    success: '🧩 Parámetros revisados',
    error: '❌ Error al leer la plantilla',
  },
  backstage_list_entities: {
    start: '🗂️ Consultando el catálogo...',
    success: '🗂️ Catálogo consultado',
    error: '❌ Error al consultar el catálogo',
  },
  backstage_get_entity: {
    start: '📄 Leyendo entidad del catálogo...',
    success: '📄 Entidad leída',
    error: '❌ Error al leer la entidad',
  },
  github_check_repo_availability: {
    start: '🧪 Comprobando si el repo ya existe en GitHub...',
    success: '🧪 El nombre del repo está disponible',
    error: '❌ El nombre del repo no está disponible',
  },
  backstage_create_scaffolder_task: {
    start: '🚀 Lanzando la creación en Backstage...',
    success: '🚀 Tarea de creación lanzada',
    error: '❌ Error al lanzar la creación',
  },
  backstage_get_scaffolder_task: {
    start: '⏳ Comprobando el estado de la creación...',
    success: '⏳ Estado de la creación actualizado',
    error: '❌ Error al revisar el estado',
  },
  backstage_search: {
    start: '🔎 Buscando en Backstage...',
    success: '🔎 Búsqueda completada',
    error: '❌ Error en la búsqueda',
  },
};

function getProgressCopy(event: ChatProgressEvent): {
  key: string;
  label: string;
  status: ChatProgressStep['status'];
} | null {
  if (event.action === 'agent_start') {
    return {
      key: `agent:${event.agent || 'agent'}`,
      label: `🤖 ${event.agent || 'Agente'} trabajando...`,
      status: 'running',
    };
  }

  if (event.action === 'agent_end') {
    return {
      key: `agent:${event.agent || 'agent'}`,
      label: `🤖 ${event.agent || 'Agente'} completado`,
      status: 'completed',
    };
  }

  if (!event.tool) {
    return null;
  }

  const toolName = event.tool;
  const copy = TOOL_PROGRESS_COPY[toolName] || {
    start: `🔧 Ejecutando ${toolName}...`,
    success: `🔧 ${toolName} completado`,
    error: `❌ ${toolName} falló`,
  };

  const isStart = event.action === 'tool_start';
  const isError = event.success === false;

  return {
    key: `tool:${toolName}`,
    label: isStart ? copy.start : isError ? copy.error : copy.success,
    status: isStart ? 'running' : isError ? 'failed' : 'completed',
  };
}

function getProgressLabel(event: ChatProgressEvent): string | null {
  const progressCopy = getProgressCopy(event);
  if (!progressCopy) {
    return null;
  }

  switch (event.action) {
    case 'tool_start':
      return progressCopy.label;
    case 'tool_end':
      return event.success === false ? progressCopy.label : null;
    case 'agent_start':
      return progressCopy.label;
    case 'agent_end':
      return null;
    default:
      return null;
  }
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
            const defaultModel =
              data.find(m => m.id === DEFAULT_MODEL_ID) ||
              data.find(m => /claude.*opus.*4\.5/i.test(m.name));
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
      let hasReceivedDelta = false;
      let showingSyntheticProgress = false;

      // Add user message immediately
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
            currentUrl: window.location.href,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

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
                hasReceivedDelta = true;
                setToolAction(null);
                const replaceSyntheticProgress = showingSyntheticProgress;
                // Append delta to the assistant message
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

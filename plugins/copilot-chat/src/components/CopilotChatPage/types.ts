export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatProgressEvent {
  type: 'progress';
  action: 'tool_start' | 'tool_end' | 'agent_start' | 'agent_end';
  tool?: string;
  agent?: string;
  success?: boolean;
}

export interface ChatProgressStep {
  id: string;
  key: string;
  label: string;
  status: 'running' | 'completed' | 'failed';
}

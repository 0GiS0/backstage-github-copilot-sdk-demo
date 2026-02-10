import { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';
import { ChatMessage } from './types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { TypingIndicator } from './TypingIndicator';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 130px)',
    padding: 0,
    overflow: 'hidden',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2, 3),
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.divider,
      borderRadius: 3,
    },
  },
  emptyContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

let messageCounter = 0;
function createId() {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

export const CopilotChatPage = () => {
  const classes = useStyles();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const simulateResponse = useCallback((userMessage: string) => {
    setIsLoading(true);
    // Simulate a backend response — this will be replaced with a real API call
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content: `Thanks for your question! I received: "${userMessage}"\n\nThis is a placeholder response. Once the backend plugin is connected to the GitHub Copilot SDK, I'll provide real answers about your Backstage catalog, services, and developer workflows.`,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: createId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      simulateResponse(text);
    },
    [simulateResponse],
  );

  const hasMessages = messages.length > 0;

  return (
    <Page themeId="tool">
      <Header title="Copilot Chat" subtitle="Powered by GitHub Copilot SDK" />
      <Content className={classes.content}>
        {hasMessages ? (
          <div className={classes.messagesArea}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className={classes.emptyContainer}>
            <EmptyState onSuggestionClick={handleSend} />
          </div>
        )}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </Content>
    </Page>
  );
};

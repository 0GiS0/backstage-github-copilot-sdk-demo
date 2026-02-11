import { useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { TypingIndicator } from './TypingIndicator';
import { useCopilotChat } from './useCopilotChat';

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

export const CopilotChatPage = () => {
  const classes = useStyles();
  const { messages, isLoading, handleSend } = useCopilotChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

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

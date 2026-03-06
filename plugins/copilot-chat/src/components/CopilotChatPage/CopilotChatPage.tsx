import { useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { ProgressPanel } from './ProgressPanel';
import { TypingIndicator } from './TypingIndicator';
import { ModelSelector } from './ModelSelector';
import { useCopilotChat } from './useCopilotChat';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 130px)',
    padding: 0,
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0.75, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    flexShrink: 0,
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
  const {
    messages,
    isLoading,
    handleSend,
    userAvatarUrl,
    models,
    selectedModel,
    changeModel,
    modelsLoading,
    toolAction,
    progressSteps,
  } = useCopilotChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const visibleMessages = messages.filter(msg => msg.content !== '');
  const hasMessages = visibleMessages.length > 0;

  return (
    <Page themeId="tool">
      <Header title="Copilot Chat" subtitle="Powered by GitHub Copilot SDK" />
      <Content className={classes.content}>
        <div className={classes.toolbar}>
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onChange={changeModel}
            disabled={isLoading}
            loading={modelsLoading}
          />
        </div>
        {hasMessages ? (
          <div className={classes.messagesArea}>
            {visibleMessages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                userAvatarUrl={userAvatarUrl}
              />
            ))}
            <ProgressPanel steps={progressSteps} />
            {isLoading && <TypingIndicator label={toolAction || undefined} />}
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

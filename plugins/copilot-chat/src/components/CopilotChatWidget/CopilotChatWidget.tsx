import { useState, useRef, useEffect, useCallback } from 'react';
import {
  makeStyles,
  Fab,
  Fade,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import { MessageBubble } from '../CopilotChatPage/MessageBubble';
import { ChatInput } from '../CopilotChatPage/ChatInput';
import { TypingIndicator } from '../CopilotChatPage/TypingIndicator';
import { useCopilotChat } from '../CopilotChatPage/useCopilotChat';
import { CopilotIcon } from './CopilotIcon';
import { WidgetEmptyState } from './WidgetEmptyState';

const WIDGET_WIDTH = 400;
const WIDGET_HEIGHT = 560;

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: theme.zIndex.snackbar + 1,
    background: '#000',
    color: '#fff',
    width: 72,
    height: 72,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
    '&:hover': {
      background: '#1a1a1a',
      boxShadow: '0 6px 28px rgba(0, 0, 0, 0.5)',
    },
    transition: 'all 0.2s ease',
  },
  fabIcon: {
    width: 46,
    height: 46,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#22c55e',
    border: `2px solid ${theme.palette.background.default}`,
  },
  panel: {
    position: 'fixed',
    bottom: theme.spacing(3) + 56 + 12,
    right: theme.spacing(3),
    width: WIDGET_WIDTH,
    height: WIDGET_HEIGHT,
    zIndex: theme.zIndex.snackbar + 1,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2),
    background: '#000',
    color: '#fff',
    flexShrink: 0,
  },
  headerIcon: {
    width: 28,
    height: 28,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    lineHeight: 1.2,
  },
  headerSubtitle: {
    fontSize: '0.7rem',
    opacity: 0.85,
    lineHeight: 1.2,
  },
  headerButton: {
    color: 'rgba(255,255,255,0.8)',
    padding: 6,
    '&:hover': {
      color: '#fff',
      background: 'rgba(255,255,255,0.15)',
    },
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: 5,
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
  tooltip: {
    position: 'fixed',
    bottom: theme.spacing(3) + 72 + 8,
    right: theme.spacing(3),
    background: '#000',
    color: '#fff',
    padding: theme.spacing(1, 1.5),
    borderRadius: 10,
    fontSize: '0.82rem',
    fontWeight: 600,
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    zIndex: theme.zIndex.snackbar + 1,
    whiteSpace: 'nowrap',
    animation: '$bounce 2s ease-in-out infinite',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -6,
      right: 28,
      width: 12,
      height: 12,
      background: '#000',
      transform: 'rotate(45deg)',
      borderRadius: 2,
    },
  },
  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-4px)' },
  },
}));

export const CopilotChatWidget = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const { messages, isLoading, handleSend, handleClear } = useCopilotChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Floating Action Button */}
      {!open && (
        <Fade in>
          <Fab
            className={classes.fab}
            onClick={() => {
              setOpen(true);
              setHasBeenOpened(true);
            }}
            aria-label="Open Copilot Chat"
          >
            <CopilotIcon className={classes.fabIcon} />
            <div className={classes.badge} />
          </Fab>
        </Fade>
      )}

      {/* Pssst tooltip */}
      {!open && !hasBeenOpened && (
        <Fade in>
          <div className={classes.tooltip}>Pssst pssst... need help? 👀</div>
        </Fade>
      )}

      {/* Chat Panel */}
      <Fade in={open} unmountOnExit>
        <div className={classes.panel}>
          {/* Header */}
          <div className={classes.header}>
            <CopilotIcon className={classes.headerIcon} />
            <div className={classes.headerText}>
              <Typography className={classes.headerTitle}>
                Copilot Chat
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Powered by GitHub Copilot SDK
              </Typography>
            </div>
            {hasMessages && (
              <IconButton
                className={classes.headerButton}
                size="small"
                onClick={handleClear}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              className={classes.headerButton}
              size="small"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Messages */}
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
              <WidgetEmptyState onSuggestionClick={handleSend} />
            </div>
          )}

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </Fade>

      {/* FAB when panel is open (to close) */}
      {open && (
        <Fade in>
          <Fab
            className={classes.fab}
            onClick={() => setOpen(false)}
            aria-label="Close Copilot Chat"
          >
            <CloseIcon />
          </Fab>
        </Fade>
      )}
    </>
  );
};

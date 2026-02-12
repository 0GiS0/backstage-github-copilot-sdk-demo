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
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { MessageBubble } from '../CopilotChatPage/MessageBubble';
import { ChatInput } from '../CopilotChatPage/ChatInput';
import { TypingIndicator } from '../CopilotChatPage/TypingIndicator';
import { ModelSelector } from '../CopilotChatPage/ModelSelector';
import { useCopilotChat } from '../CopilotChatPage/useCopilotChat';
import { CopilotIcon } from './CopilotIcon';
import { WidgetEmptyState } from './WidgetEmptyState';

const WIDGET_MIN_WIDTH = 380;
const WIDGET_MIN_HEIGHT = 440;
const WIDGET_DEFAULT_WIDTH = 520;
const WIDGET_DEFAULT_HEIGHT = 640;

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
    zIndex: theme.zIndex.snackbar + 1,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  panelFullscreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw !important',
    height: '100vh !important',
    borderRadius: 0,
    zIndex: theme.zIndex.modal + 1,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  resizeHandle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 16,
    cursor: 'nw-resize',
    zIndex: 10,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 4,
      left: 4,
      width: 8,
      height: 8,
      borderTop: `2px solid ${theme.palette.divider}`,
      borderLeft: `2px solid ${theme.palette.divider}`,
      borderRadius: '2px 0 0 0',
      opacity: 0,
      transition: 'opacity 0.2s',
    },
    '&:hover::before': {
      opacity: 1,
    },
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
  modelToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0.5, 1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    flexShrink: 0,
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
  fabBarsOverlay: {
    position: 'absolute',
    top: -10,
    left: -10,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 3,
    height: 22,
    padding: '4px 6px',
    borderRadius: 10,
    background: 'rgba(0,0,0,0.85)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    pointerEvents: 'none',
  },
  fabBar: {
    width: 4,
    borderRadius: 2,
    background: '#1db954',
    animation: '$fabEqualizer 1.2s ease-in-out infinite',
    '&:nth-child(1)': { animationDelay: '0s', height: 8 },
    '&:nth-child(2)': { animationDelay: '0.15s', height: 16 },
    '&:nth-child(3)': { animationDelay: '0.3s', height: 6 },
    '&:nth-child(4)': { animationDelay: '0.45s', height: 12 },
  },
  '@keyframes fabEqualizer': {
    '0%, 100%': { transform: 'scaleY(1)' },
    '50%': { transform: 'scaleY(0.3)' },
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [size, setSize] = useState({
    width: WIDGET_DEFAULT_WIDTH,
    height: WIDGET_DEFAULT_HEIGHT,
  });
  const {
    messages,
    isLoading,
    handleSend,
    handleClear,
    userAvatarUrl,
    models,
    selectedModel,
    changeModel,
    modelsLoading,
  } = useCopilotChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Resize from top-left corner
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (isFullscreen) return;
      e.preventDefault();
      isResizing.current = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;

      const onMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        // Dragging top-left: moving left increases width, moving up increases height
        const deltaX = startX - ev.clientX;
        const deltaY = startY - ev.clientY;
        setSize({
          width: Math.max(WIDGET_MIN_WIDTH, startWidth + deltaX),
          height: Math.max(WIDGET_MIN_HEIGHT, startHeight + deltaY),
        });
      };

      const onMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'nw-resize';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [isFullscreen, size],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const visibleMessages = messages.filter(msg => msg.content !== '');
  const hasMessages = visibleMessages.length > 0;

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
            {!hasBeenOpened && (
              <div className={classes.fabBarsOverlay}>
                <div className={classes.fabBar} />
                <div className={classes.fabBar} />
                <div className={classes.fabBar} />
                <div className={classes.fabBar} />
              </div>
            )}
          </Fab>
        </Fade>
      )}

      {/* Singing tooltip */}
      {!open && !hasBeenOpened && (
        <Fade in>
          <div className={classes.tooltip}>
            🎤 Hey! I know a song about your catalog… 🎶
          </div>
        </Fade>
      )}

      {/* Chat Panel */}
      <Fade in={open} unmountOnExit>
        <div
          ref={panelRef}
          className={`${classes.panel} ${
            isFullscreen ? classes.panelFullscreen : ''
          }`}
          style={
            isFullscreen
              ? undefined
              : { width: size.width, height: size.height }
          }
        >
          {/* Resize handle (top-left, hidden in fullscreen) */}
          {!isFullscreen && (
            <div
              className={classes.resizeHandle}
              onMouseDown={handleResizeStart}
            />
          )}

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
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <FullscreenExitIcon fontSize="small" />
              ) : (
                <FullscreenIcon fontSize="small" />
              )}
            </IconButton>
            <IconButton
              className={classes.headerButton}
              size="small"
              onClick={() => {
                setOpen(false);
                setIsFullscreen(false);
              }}
              aria-label="Close chat"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          {/* Model selector */}
          <div className={classes.modelToolbar}>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onChange={changeModel}
              disabled={isLoading}
              loading={modelsLoading}
            />
          </div>
          {/* Messages */}
          {hasMessages ? (
            <div className={classes.messagesArea}>
              {visibleMessages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  userAvatarUrl={userAvatarUrl}
                />
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
      {open && !isFullscreen && (
        <Fade in>
          <Fab
            className={classes.fab}
            onClick={() => {
              setOpen(false);
              setIsFullscreen(false);
            }}
            aria-label="Close Copilot Chat"
          >
            <CloseIcon />
          </Fab>
        </Fade>
      )}
    </>
  );
};

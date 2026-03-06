import { Link, makeStyles, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from './types';
import copilotLogo from '../../assets/copilot-logo.png';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    marginBottom: theme.spacing(1.5),
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  messageWrapper: {
    maxWidth: '75%',
    minWidth: 40,
  },
  bubble: {
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    wordBreak: 'break-word' as const,
    lineHeight: 1.5,
    fontSize: '0.875rem',
  },
  plainText: {
    whiteSpace: 'pre-wrap' as const,
  },
  bubbleUser: {
    background: theme.palette.type === 'dark' ? '#1a7f37' : '#dafbe1',
    color: theme.palette.type === 'dark' ? '#fff' : '#1a2b1a',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    background: theme.palette.type === 'dark' ? '#2d333b' : '#f6f8fa',
    color: theme.palette.text.primary,
    borderBottomLeftRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 2,
    overflow: 'hidden',
  },
  avatarAssistant: {
    background: '#000',
    marginRight: theme.spacing(1),
  },
  avatarUser: {
    background: theme.palette.type === 'dark' ? '#388bfd' : '#0969da',
    color: '#fff',
    marginLeft: theme.spacing(1),
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  copilotImg: {
    width: 26,
    height: 26,
  },
  markdown: {
    '& > *:first-child': {
      marginTop: 0,
    },
    '& > *:last-child': {
      marginBottom: 0,
    },
    '& p': {
      margin: `${theme.spacing(1)}px 0`,
    },
    '& ul, & ol': {
      margin: `${theme.spacing(1)}px 0`,
      paddingLeft: theme.spacing(3),
    },
    '& li + li': {
      marginTop: theme.spacing(0.5),
    },
    '& code': {
      fontFamily: 'monospace',
      fontSize: '0.8125rem',
      background: theme.palette.type === 'dark' ? '#161b22' : '#eaeef2',
      borderRadius: 4,
      padding: '0.1em 0.35em',
    },
    '& pre': {
      overflowX: 'auto' as const,
      background: theme.palette.type === 'dark' ? '#161b22' : '#eaeef2',
      borderRadius: 8,
      padding: theme.spacing(1.5),
      margin: `${theme.spacing(1.5)}px 0`,
    },
    '& pre code': {
      background: 'transparent',
      padding: 0,
      borderRadius: 0,
    },
    '& blockquote': {
      margin: `${theme.spacing(1.5)}px 0`,
      paddingLeft: theme.spacing(1.5),
      borderLeft: `3px solid ${theme.palette.divider}`,
      color: theme.palette.text.secondary,
    },
    '& table': {
      width: '100%',
      borderCollapse: 'collapse' as const,
      margin: `${theme.spacing(1.5)}px 0`,
    },
    '& th, & td': {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(0.75, 1),
      textAlign: 'left' as const,
    },
    '& a': {
      wordBreak: 'break-all' as const,
    },
  },
  time: {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  timeUser: {
    textAlign: 'right',
  },
}));

interface MessageBubbleProps {
  message: ChatMessage;
  userAvatarUrl?: string;
}

export const MessageBubble = ({
  message,
  userAvatarUrl,
}: MessageBubbleProps) => {
  const classes = useStyles();
  const isUser = message.role === 'user';

  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`${classes.row} ${
        isUser ? classes.rowUser : classes.rowAssistant
      }`}
    >
      {!isUser && (
        <div className={`${classes.avatar} ${classes.avatarAssistant}`}>
          <img src={copilotLogo} alt="Copilot" className={classes.copilotImg} />
        </div>
      )}
      <div className={classes.messageWrapper}>
        <div
          className={`${classes.bubble} ${
            isUser ? classes.bubbleUser : classes.bubbleAssistant
          }`}
        >
          {isUser ? (
            <div className={classes.plainText}>{message.content}</div>
          ) : (
            <ReactMarkdown
              className={classes.markdown}
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node: _node, ...props }) => (
                  <Link {...props} target="_blank" rel="noreferrer" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <Typography
          className={`${classes.time} ${isUser ? classes.timeUser : ''}`}
        >
          {timeStr}
        </Typography>
      </div>
      {isUser && (
        <div className={`${classes.avatar} ${classes.avatarUser}`}>
          {userAvatarUrl ? (
            <img src={userAvatarUrl} alt="User" className={classes.avatarImg} />
          ) : (
            'U'
          )}
        </div>
      )}
    </div>
  );
};

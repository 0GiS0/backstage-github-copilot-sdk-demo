import { useState, KeyboardEvent } from 'react';
import {
  makeStyles,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 12,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0.5, 1.5),
    transition: 'border-color 0.2s',
    '&:focus-within': {
      borderColor: theme.palette.primary.main,
    },
  },
  input: {
    flex: 1,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  sendButton: {
    background: '#7c3aed',
    color: '#fff',
    width: 36,
    height: 36,
    '&:hover': {
      background: '#6d28d9',
    },
    '&:disabled': {
      background: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
  },
  sendIcon: {
    fontSize: '1.1rem',
  },
}));

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const classes = useStyles();
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.inputWrapper} elevation={0}>
        <InputBase
          className={classes.input}
          placeholder="Ask GitHub Copilot something…"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          multiline
          maxRows={4}
        />
      </Paper>
      <IconButton
        className={classes.sendButton}
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        size="small"
        aria-label="Send message"
      >
        <SendIcon className={classes.sendIcon} />
      </IconButton>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import copilotLogo from '../../assets/copilot-logo.png';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    marginBottom: theme.spacing(1.5),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    marginRight: theme.spacing(1),
    flexShrink: 0,
    marginTop: 2,
  },
  copilotImg: {
    width: 20,
    height: 20,
  },
  bubble: {
    maxWidth: '85%',
    padding: theme.spacing(1.5, 3),
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    background: theme.palette.type === 'dark' ? '#2d333b' : '#f6f8fa',
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  equalizer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 3,
    height: 20,
    padding: '2px 0',
  },
  bar: {
    width: 3,
    borderRadius: 2,
    background: '#1db954', // Spotify green!
    animation: '$equalize 1.2s ease-in-out infinite',
    '&:nth-child(1)': {
      animationDelay: '0s',
      height: 6,
    },
    '&:nth-child(2)': {
      animationDelay: '-0.8s',
      height: 10,
    },
    '&:nth-child(3)': {
      animationDelay: '-0.4s',
      height: 14,
    },
    '&:nth-child(4)': {
      animationDelay: '-0.2s',
      height: 8,
    },
    '&:nth-child(5)': {
      animationDelay: '-0.6s',
      height: 12,
    },
  },
  label: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
  },
  '@keyframes equalize': {
    '0%, 100%': {
      height: 4,
    },
    '25%': {
      height: 18,
    },
    '50%': {
      height: 8,
    },
    '75%': {
      height: 14,
    },
  },
}));

export const TypingIndicator = ({ label }: { label?: string }) => {
  const classes = useStyles();
  const [defaultLabel, setDefaultLabel] = useState('🎤 Singing…');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDefaultLabel('🎤 Singing… oops! I mean 🤔 Thinking…');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={classes.row}>
      <div className={classes.avatar}>
        <img src={copilotLogo} alt="Copilot" className={classes.copilotImg} />
      </div>
      <div className={classes.bubble}>
        <div className={classes.equalizer}>
          <div className={classes.bar} />
          <div className={classes.bar} />
          <div className={classes.bar} />
          <div className={classes.bar} />
          <div className={classes.bar} />
        </div>
        <span className={classes.label}>{label || defaultLabel}</span>
      </div>
    </div>
  );
};

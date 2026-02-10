import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    marginBottom: theme.spacing(1.5),
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: theme.palette.type === 'dark' ? '#8b5cf6' : '#7c3aed',
    color: '#fff',
    marginRight: theme.spacing(1),
    flexShrink: 0,
    marginTop: 2,
  },
  bubble: {
    maxWidth: '75%',
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    background: theme.palette.type === 'dark' ? '#2d333b' : '#f6f8fa',
    border: `1px solid ${theme.palette.divider}`,
  },
  dots: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    height: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#7c3aed',
    animation: '$bounce 1.4s infinite ease-in-out both',
    '&:nth-child(1)': { animationDelay: '-0.32s' },
    '&:nth-child(2)': { animationDelay: '-0.16s' },
    '&:nth-child(3)': { animationDelay: '0s' },
  },
  '@keyframes bounce': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' },
  },
}));

export const TypingIndicator = () => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      <div className={classes.avatar}>CP</div>
      <div className={classes.bubble}>
        <div className={classes.dots}>
          <div className={classes.dot} />
          <div className={classes.dot} />
          <div className={classes.dot} />
        </div>
      </div>
    </div>
  );
};

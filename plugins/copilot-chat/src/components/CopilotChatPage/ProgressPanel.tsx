import { makeStyles } from '@material-ui/core';
import { ChatProgressStep } from './types';

const useStyles = makeStyles(theme => ({
  panel: {
    maxWidth: '85%',
    marginBottom: theme.spacing(1.5),
    marginLeft: 44,
    padding: theme.spacing(1.25, 1.5),
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    background: theme.palette.type === 'dark' ? '#1f242b' : '#f8fafc',
    border: `1px solid ${theme.palette.divider}`,
  },
  title: {
    fontSize: '0.74rem',
    fontWeight: 700,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.75),
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(0.75),
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '0.84rem',
    color: theme.palette.text.primary,
  },
  icon: {
    width: 18,
    textAlign: 'center' as const,
    flexShrink: 0,
  },
  stepRunning: {
    color: theme.palette.type === 'dark' ? '#93c5fd' : '#1d4ed8',
  },
  stepCompleted: {
    color: theme.palette.type === 'dark' ? '#86efac' : '#166534',
  },
  stepFailed: {
    color: theme.palette.type === 'dark' ? '#fca5a5' : '#b91c1c',
  },
}));

interface ProgressPanelProps {
  steps: ChatProgressStep[];
}

function getStatusIcon(status: ChatProgressStep['status']) {
  switch (status) {
    case 'running':
      return '⋯';
    case 'completed':
      return '✓';
    case 'failed':
      return '!';
    default:
      return '•';
  }
}

export const ProgressPanel = ({ steps }: ProgressPanelProps) => {
  const classes = useStyles();

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={classes.panel}>
      <div className={classes.title}>Activity</div>
      <div className={classes.list}>
        {steps.map(step => {
          let statusClass = classes.stepCompleted;
          if (step.status === 'running') {
            statusClass = classes.stepRunning;
          } else if (step.status === 'failed') {
            statusClass = classes.stepFailed;
          }

          return (
            <div
              key={step.id}
              className={`${classes.step} ${statusClass}`}
            >
              <span className={classes.icon}>{getStatusIcon(step.status)}</span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

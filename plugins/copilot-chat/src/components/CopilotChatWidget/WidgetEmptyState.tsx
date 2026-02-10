import { makeStyles, Typography } from '@material-ui/core';
import copilotLogo from '../../assets/copilot-logo.png';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  logo: {
    width: 56,
    height: 56,
    padding: 10,
    borderRadius: '50%',
    background: '#000',
    marginBottom: theme.spacing(1.5),
  },
  title: {
    fontWeight: 600,
    fontSize: '0.95rem',
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  subtitle: {
    fontSize: '0.78rem',
    lineHeight: 1.4,
    maxWidth: 260,
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(2),
    width: '100%',
    maxWidth: 300,
  },
  chip: {
    padding: theme.spacing(0.8, 1.5),
    borderRadius: 10,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.default,
    cursor: 'pointer',
    fontSize: '0.78rem',
    textAlign: 'left',
    transition: 'all 0.15s',
    '&:hover': {
      borderColor: '#7c3aed',
      color: '#7c3aed',
      background:
        theme.palette.type === 'dark'
          ? 'rgba(124,58,237,0.08)'
          : 'rgba(124,58,237,0.04)',
    },
  },
}));

interface WidgetEmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  '🔍 What services are in the catalog?',
  '📦 How do I create a new component?',
  '🛠️ Explain the CI/CD pipeline',
];

export const WidgetEmptyState = ({
  onSuggestionClick,
}: WidgetEmptyStateProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={copilotLogo} alt="Copilot" className={classes.logo} />
      <Typography className={classes.title}>How can I help you?</Typography>
      <Typography variant="body2" className={classes.subtitle}>
        Ask anything about your software catalog, services, or workflows.
      </Typography>
      <div className={classes.suggestions}>
        {suggestions.map(s => (
          <div
            key={s}
            className={classes.chip}
            role="button"
            tabIndex={0}
            onClick={() => onSuggestionClick(s)}
            onKeyDown={e => e.key === 'Enter' && onSuggestionClick(s)}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

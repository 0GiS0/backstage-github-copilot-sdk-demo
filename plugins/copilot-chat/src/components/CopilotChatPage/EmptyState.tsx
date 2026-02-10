import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    fontSize: '1.8rem',
    color: '#fff',
    fontWeight: 700,
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    maxWidth: 500,
  },
  chip: {
    padding: theme.spacing(1, 2),
    borderRadius: 20,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.15s',
    '&:hover': {
      borderColor: '#7c3aed',
      color: '#7c3aed',
    },
  },
}));

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  '🔍 What services are in the catalog?',
  '📦 How do I create a new component?',
  '🛠️ Explain the CI/CD pipeline',
  '📄 Summarize the API docs',
];

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.logo}>✦</div>
      <Typography variant="h5" className={classes.title}>
        GitHub Copilot for Backstage
      </Typography>
      <Typography variant="body2">
        Ask anything about your software catalog, services, or developer
        workflows.
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

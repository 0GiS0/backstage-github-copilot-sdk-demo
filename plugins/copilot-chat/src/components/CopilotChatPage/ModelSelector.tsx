import { makeStyles, Select, MenuItem, Typography } from '@material-ui/core';
import { CopilotModel } from './useCopilotChat';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  select: {
    fontSize: '0.8rem',
    padding: theme.spacing(0.25, 1),
    borderRadius: 6,
    background:
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(0,0,0,0.04)',
    border: `1px solid ${theme.palette.divider}`,
    '& .MuiSelect-select': {
      paddingTop: 4,
      paddingBottom: 4,
    },
  },
  label: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  premium: {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    marginLeft: 4,
  },
}));

function formatPremium(multiplier: number): string {
  if (multiplier === 1) return '1x';
  if (multiplier < 1) return `${multiplier}x`;
  return `${multiplier}x`;
}

interface ModelSelectorProps {
  models: CopilotModel[];
  selectedModel: string;
  onChange: (modelId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ModelSelector = ({
  models,
  selectedModel,
  onChange,
  disabled = false,
  loading = false,
}: ModelSelectorProps) => {
  const classes = useStyles();

  if (loading) {
    return (
      <div className={classes.root}>
        <Typography className={classes.label}>Loading models…</Typography>
      </div>
    );
  }

  if (models.length === 0) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.label}>Model:</Typography>
      <Select
        className={classes.select}
        value={selectedModel}
        onChange={e => onChange(e.target.value as string)}
        disabled={disabled}
        disableUnderline
        variant="standard"
        MenuProps={{
          style: { zIndex: 2147483647 },
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          transformOrigin: { vertical: 'top', horizontal: 'left' },
          getContentAnchorEl: null,
        }}
      >
        {models.map(m => (
          <MenuItem key={m.id} value={m.id}>
            {m.name}
            <span className={classes.premium}>
              ({formatPremium(m.premiumRequests)})
            </span>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

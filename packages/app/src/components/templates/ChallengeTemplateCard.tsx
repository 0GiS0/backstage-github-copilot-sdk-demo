import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

type ChallengeTemplateCardProps = {
  template: TemplateEntityV1beta3;
  onSelected?: (template: TemplateEntityV1beta3) => void;
};

const TEMPLATE_ACCENTS: Record<string, string> = {
  'astro-frontend': '#6ee7d8',
  'vue-frontend': '#86efac',
  'node-service': '#fde68a',
  'fastapi-service': '#93c5fd',
  'springboot-service': '#fdba74',
  'dotnet-service': '#c4b5fd',
  'dotnet-library': '#f9a8d4',
  'electron-desktop-app': '#67e8f9',
  'ai-assistant': '#fda4af',
  'mcp-server-node': '#a7f3d0',
  'kubernetes-gitops': '#fca5a5',
  system: '#bfdbfe',
  domain: '#ddd6fe',
};

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2.5),
    borderRadius: 24,
    background: 'linear-gradient(180deg, #fffdf8 0%, #fff7ea 100%)',
    border: '1px solid rgba(8, 17, 26, 0.08)',
    boxShadow: '0 20px 40px rgba(15, 23, 35, 0.10)',
    transition:
      'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 28px 48px rgba(15, 23, 35, 0.14)',
      borderColor: 'rgba(8, 17, 26, 0.16)',
    },
  },
  accent: {
    width: 58,
    height: 6,
    borderRadius: 999,
    marginBottom: theme.spacing(2),
  },
  category: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
    color: 'rgba(8, 17, 26, 0.56)',
    marginBottom: theme.spacing(1),
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#08111a',
    marginBottom: theme.spacing(1),
  },
  description: {
    color: 'rgba(8, 17, 26, 0.72)',
    lineHeight: 1.7,
    marginBottom: theme.spacing(2),
    flex: 1,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  chip: {
    fontWeight: 700,
    background: '#f2ede2',
    color: '#3f3f46',
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  primaryAction: {
    borderRadius: 999,
    fontWeight: 700,
    color: '#08111a',
  },
  secondaryAction: {
    borderRadius: 999,
    fontWeight: 700,
  },
}));

const toCategory = (template: TemplateEntityV1beta3) => {
  const title = template.metadata.title ?? template.metadata.name;

  if (title.toLowerCase().includes('frontend')) {
    return 'Frontend';
  }
  if (title.toLowerCase().includes('assistant')) {
    return 'AI';
  }
  if (title.toLowerCase().includes('desktop')) {
    return 'Desktop';
  }
  if (title.toLowerCase().includes('gitops')) {
    return 'Ops';
  }
  if (
    title.toLowerCase().includes('domain') ||
    title.toLowerCase().includes('system')
  ) {
    return 'Catalog';
  }
  if (title.toLowerCase().includes('library')) {
    return 'Library';
  }
  if (title.toLowerCase().includes('mcp')) {
    return 'Platform';
  }

  return template.spec.type === 'service' ? 'Service' : 'Template';
};

export const ChallengeTemplateCard = ({
  template,
  onSelected,
}: ChallengeTemplateCardProps) => {
  const classes = useStyles();
  const name = template.metadata.name;
  const title = template.metadata.title ?? name;
  const description =
    template.metadata.description ??
    'Localized challenge template ready to scaffold and publish.';
  const tags = (template.metadata.tags ?? []).slice(0, 3);
  const accent = TEMPLATE_ACCENTS[name] ?? '#cbd5e1';

  return (
    <Paper className={classes.card} elevation={0}>
      <div className={classes.accent} style={{ background: accent }} />
      <Typography className={classes.category}>
        {toCategory(template)}
      </Typography>
      <Typography className={classes.title}>{title}</Typography>
      <Typography className={classes.description}>{description}</Typography>
      <Box className={classes.tags}>
        {tags.map(tag => (
          <Chip key={tag} label={tag} size="small" className={classes.chip} />
        ))}
      </Box>
      <Box className={classes.actions}>
        <Button
          className={classes.primaryAction}
          variant="contained"
          style={{ background: accent }}
          endIcon={<PlayCircleOutlineIcon />}
          onClick={() => onSelected?.(template)}
        >
          Launch Template
        </Button>
        <Button
          className={classes.secondaryAction}
          variant="outlined"
          color="primary"
          href={`/catalog/default/template/${name}`}
          endIcon={<ArrowForwardIcon />}
        >
          Template Entity
        </Button>
      </Box>
    </Paper>
  );
};

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import CodeIcon from '@material-ui/icons/Code';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StarsIcon from '@material-ui/icons/Stars';
import { Page } from '@backstage/core-components';
import { Link as RouterLink } from 'react-router-dom';
import copilotAvatar from '../../assets/github-copilot-logo.png';

const useStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    minWidth: 0,
    gridColumn: '1 / -1',
    justifySelf: 'stretch',
    padding: theme.spacing(4, 0, 8),
    background:
      'radial-gradient(circle at top left, rgba(94,234,212,0.16), transparent 32%), radial-gradient(circle at top right, rgba(251,191,36,0.14), transparent 24%), linear-gradient(180deg, #08111a 0%, #0f1723 38%, #f4efe6 38%, #f4efe6 100%)',
    minHeight: '100vh',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5, 0, 9),
    },
  },
  shell: {
    position: 'relative',
    width: '100%',
    minWidth: 0,
    maxWidth: 'none',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 28,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    background:
      'linear-gradient(140deg, rgba(8,17,26,0.98) 0%, rgba(15,23,35,0.95) 42%, rgba(18,36,49,0.92) 100%)',
    color: '#f8fafc',
    border: '1px solid rgba(125, 243, 225, 0.2)',
    boxShadow: '0 24px 70px rgba(2, 8, 23, 0.20)',
    minHeight: 420,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
      minHeight: 'auto',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 'auto -10% -30% auto',
      width: 320,
      height: 320,
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(125,243,225,0.35) 0%, rgba(125,243,225,0) 68%)',
      pointerEvents: 'none',
    },
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.8, 1.5),
    borderRadius: 999,
    background: 'rgba(125, 243, 225, 0.12)',
    color: '#9af7ea',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: theme.spacing(2.5),
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    marginBottom: theme.spacing(2),
    maxWidth: 760,
  },
  heroSubtitle: {
    maxWidth: 760,
    color: 'rgba(226, 232, 240, 0.9)',
    fontSize: '1rem',
    lineHeight: 1.65,
    marginBottom: theme.spacing(2.5),
  },
  actionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  primaryAction: {
    borderRadius: 999,
    padding: theme.spacing(1.3, 2.2),
    background: '#7df3e1',
    color: '#08111a',
    fontWeight: 700,
    '&:hover': {
      background: '#9af7ea',
    },
  },
  secondaryAction: {
    borderRadius: 999,
    padding: theme.spacing(1.3, 2.2),
    color: '#f8fafc',
    borderColor: 'rgba(248, 250, 252, 0.22)',
  },
  statRail: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: theme.spacing(1.25),
    maxWidth: 860,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      maxWidth: '100%',
    },
  },
  statCard: {
    borderRadius: 18,
    padding: theme.spacing(1.75),
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f8fafc',
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: theme.spacing(0.5),
    color: '#f8fafc',
  },
  statLabel: {
    color: 'rgba(226, 232, 240, 0.82)',
  },
  artworkWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: '100%',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      paddingTop: theme.spacing(1),
    },
  },
  artwork: {
    width: 'clamp(260px, 28vw, 440px)',
    maxWidth: '100%',
    filter: 'drop-shadow(0 24px 48px rgba(2, 8, 23, 0.34))',
    animation: '$floatArtwork 6.2s ease-in-out infinite',
    [theme.breakpoints.down('sm')]: {
      width: 'min(78vw, 360px)',
    },
  },
  footerNote: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2.25),
    borderRadius: 20,
    background: '#efe8da',
    color: '#3f3f46',
    border: '1px solid rgba(8, 17, 26, 0.08)',
  },
  footerTitle: {
    fontWeight: 800,
    marginBottom: theme.spacing(1),
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  footerFeature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.5),
    borderRadius: 16,
    background: 'rgba(255,255,255,0.38)',
    border: '1px solid rgba(8, 17, 26, 0.08)',
  },
  footerFeatureIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 12,
    flex: '0 0 auto',
    background: '#fff7ed',
    color: '#9a3412',
  },
  footerFeatureTitle: {
    fontWeight: 800,
    marginBottom: theme.spacing(0.35),
    color: '#27272a',
  },
  footerFeatureBody: {
    color: '#52525b',
    lineHeight: 1.55,
  },
  '@keyframes floatArtwork': {
    '0%': {
      transform: 'translate3d(0, 0, 0)',
    },
    '50%': {
      transform: 'translate3d(0, -10px, 0)',
    },
    '100%': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
}));

export const ChallengeHomePage = () => {
  const classes = useStyles();

  return (
    <Page themeId="home">
      <Box className={classes.content}>
        <Container maxWidth={false} className={classes.shell}>
          <Paper className={classes.hero} elevation={0}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7} lg={7}>
                <div className={classes.eyebrow}>
                  <StarsIcon fontSize="small" />
                  Copilot SDK Challenge Demo
                </div>
                <Typography variant="h1" className={classes.heroTitle}>
                  Backstage, upgraded with GitHub Copilot superpowers ✦
                </Typography>
                <Typography className={classes.heroSubtitle}>
                  Powered by GitHub Copilot SDK, this integration combines
                  shared Backstage and GitHub authentication, Backstage&apos;s
                  internal MCP, and a custom agent with purpose-built tools so
                  the portal can chat, understand templates, create repositories
                  directly from chat and scaffold software end to end.
                </Typography>
                <div className={classes.actionRow}>
                  <Button
                    className={classes.primaryAction}
                    variant="contained"
                    component={RouterLink}
                    to="/create"
                    endIcon={<PlayCircleOutlineIcon />}
                  >
                    Explore Templates
                  </Button>
                  <Button
                    className={classes.secondaryAction}
                    variant="outlined"
                    component={RouterLink}
                    to="/catalog/default/system/copilot-sdk-challenge"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Open Demo System
                  </Button>
                </div>
                <Box className={classes.statRail}>
                  <Paper className={classes.statCard} elevation={0}>
                    <Typography className={classes.statValue}>13</Typography>
                    <Typography className={classes.statLabel}>
                      localized templates
                    </Typography>
                  </Paper>
                  <Paper className={classes.statCard} elevation={0}>
                    <Typography className={classes.statValue}>
                      Chat + UI
                    </Typography>
                    <Typography className={classes.statLabel}>
                      same repo creation flow
                    </Typography>
                  </Paper>
                  <Paper className={classes.statCard} elevation={0}>
                    <Typography className={classes.statValue}>
                      copilot-sdk-challenge
                    </Typography>
                    <Typography className={classes.statLabel}>
                      cleaner system and owner model
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
              <Grid item xs={12} md={5} lg={5} className={classes.artworkWrap}>
                <img
                  src={copilotAvatar}
                  alt="GitHub Copilot"
                  className={classes.artwork}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper className={classes.footerNote} elevation={0}>
            <Typography className={classes.footerTitle}>
              What this demo unlocks
            </Typography>
            <Box className={classes.footerGrid}>
              <div className={classes.footerFeature}>
                <div className={classes.footerFeatureIcon}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                </div>
                <div>
                  <Typography className={classes.footerFeatureTitle}>
                    Backstage knowledge in chat
                  </Typography>
                  <Typography className={classes.footerFeatureBody}>
                    Ask GitHub Copilot about <strong>entities</strong>,
                    ownership, systems and portal context without leaving the
                    conversation.
                  </Typography>
                </div>
              </div>
              <div className={classes.footerFeature}>
                <div className={classes.footerFeatureIcon}>
                  <CodeIcon fontSize="small" />
                </div>
                <div>
                  <Typography className={classes.footerFeatureTitle}>
                    Components and code explained
                  </Typography>
                  <Typography className={classes.footerFeatureBody}>
                    The assistant can inspect{' '}
                    <strong>components, templates and code</strong> so the
                    information inside Backstage is directly usable.
                  </Typography>
                </div>
              </div>
              <div className={classes.footerFeature}>
                <div className={classes.footerFeatureIcon}>
                  <LibraryAddIcon fontSize="small" />
                </div>
                <div>
                  <Typography className={classes.footerFeatureTitle}>
                    Projects created without manual steps
                  </Typography>
                  <Typography className={classes.footerFeatureBody}>
                    Launch the same templates from <strong>Create</strong> or
                    from <strong>Copilot chat</strong>, collect inputs and
                    create repositories end to end.
                  </Typography>
                </div>
              </div>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Page>
  );
};

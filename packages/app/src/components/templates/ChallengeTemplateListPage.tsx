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
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  CatalogFilterLayout,
  EntityKindPicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntitySearchBar,
  EntityTagPicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { TemplateListPageProps } from '@backstage/plugin-scaffolder/alpha';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  TemplateGroups,
  TemplateCategoryPicker,
} from '@backstage/plugin-scaffolder-react/alpha';
import { useNavigate } from 'react-router-dom';
import { ChallengeTemplateCard } from './ChallengeTemplateCard';

const useStyles = makeStyles(theme => ({
  page: {
    width: '100%',
    minWidth: 0,
    justifySelf: 'stretch',
    background:
      'radial-gradient(circle at top left, rgba(94,234,212,0.18), transparent 28%), radial-gradient(circle at top right, rgba(251,191,36,0.14), transparent 24%), linear-gradient(180deg, #08111a 0%, #0f1723 28%, #f4efe6 28%, #f4efe6 100%)',
    minHeight: '100vh',
  },
  shell: {
    width: '100%',
    minWidth: 0,
    maxWidth: 'none',
    margin: '0 auto',
    padding: theme.spacing(4, 2, 8),
    boxSizing: 'border-box',
  },
  hero: {
    borderRadius: 28,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    background:
      'linear-gradient(140deg, rgba(8,17,26,0.98) 0%, rgba(15,23,35,0.95) 42%, rgba(13,42,52,0.92) 100%)',
    color: '#f8fafc',
    border: '1px solid rgba(125, 243, 225, 0.18)',
    boxShadow: '0 24px 70px rgba(2, 8, 23, 0.22)',
  },
  heroCopy: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 3.4rem)',
    lineHeight: 0.98,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    marginBottom: theme.spacing(1.25),
    maxWidth: 980,
  },
  subtitle: {
    color: 'rgba(226, 232, 240, 0.88)',
    lineHeight: 1.7,
    maxWidth: 980,
  },
  summaryCard: {
    height: '100%',
    borderRadius: 20,
    padding: theme.spacing(2.25),
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  summaryValue: {
    fontSize: '1.9rem',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    marginBottom: theme.spacing(0.5),
    color: '#f8fafc',
    textShadow: '0 1px 0 rgba(2, 8, 23, 0.28)',
  },
  summaryLabel: {
    color: 'rgba(241, 245, 249, 0.92)',
  },
  filtersFrame: {
    borderRadius: 24,
    padding: theme.spacing(1.5),
    background: 'rgba(255, 252, 245, 0.72)',
    border: '1px solid rgba(8,17,26,0.08)',
    boxShadow: '0 18px 36px rgba(15, 23, 35, 0.08)',
    marginBottom: theme.spacing(3),
  },
  contentHeader: {
    paddingBottom: theme.spacing(1),
  },
  importButton: {
    borderRadius: 999,
    fontWeight: 700,
  },
  '@media (max-width: 960px)': {
    shell: {
      padding: theme.spacing(3, 1, 7),
    },
    hero: {
      padding: theme.spacing(3),
    },
  },
}));

export const ChallengeTemplateListPage = (props: TemplateListPageProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const selectedTemplateRoute = useRouteRef(
    scaffolderPlugin.routes.selectedTemplate,
  );

  const groups = props.groups?.length
    ? props.groups
    : [{ title: 'Challenge Templates', filter: () => true }];

  return (
    <EntityListProvider>
      <Page themeId="home">
        <Box className={classes.page}>
          <Container maxWidth={false} className={classes.shell}>
            <Paper className={classes.hero} elevation={0}>
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} md={8}>
                  <div className={classes.heroCopy}>
                    <Typography className={classes.title}>
                      Software Templates
                    </Typography>
                    <Typography className={classes.subtitle}>
                      Use these templates to scaffold new services, components,
                      and project foundations with the standard Backstage
                      creation flow.
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={12}>
                      <Paper className={classes.summaryCard} elevation={0}>
                        <Typography className={classes.summaryValue}>
                          13
                        </Typography>
                        <Typography className={classes.summaryLabel}>
                          Localized templates in this repo
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={12}>
                      <Paper className={classes.summaryCard} elevation={0}>
                        <Typography className={classes.summaryValue}>
                          Chat + UI
                        </Typography>
                        <Typography className={classes.summaryLabel}>
                          Same creation flow, better discovery layer
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>

            <Paper className={classes.filtersFrame} elevation={0}>
              <Content>
                <div className={classes.contentHeader}>
                  <ContentHeader>
                    <Button
                      className={classes.importButton}
                      variant="outlined"
                      color="primary"
                      href="/catalog-import"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Register Existing Component
                    </Button>
                    <SupportButton>
                      Browse local templates, filter them by category and
                      owner, or jump straight into the creation flow.
                    </SupportButton>
                  </ContentHeader>
                </div>
                <CatalogFilterLayout>
                  <CatalogFilterLayout.Filters>
                    <EntitySearchBar />
                    <EntityKindPicker initialFilter="template" hidden />
                    <UserListPicker
                      initialFilter="all"
                      availableFilters={['all', 'starred']}
                    />
                    <TemplateCategoryPicker />
                    <EntityTagPicker />
                    <EntityOwnerPicker />
                  </CatalogFilterLayout.Filters>
                  <CatalogFilterLayout.Content>
                    <TemplateGroups
                      groups={groups}
                      templateFilter={props.templateFilter}
                      TemplateCardComponent={
                        props.TemplateCardComponent ?? ChallengeTemplateCard
                      }
                      onTemplateSelected={template => {
                        const { namespace, name } = parseEntityRef(
                          stringifyEntityRef(template),
                        );
                        navigate(
                          selectedTemplateRoute({
                            namespace,
                            templateName: name,
                          }),
                        );
                      }}
                    />
                  </CatalogFilterLayout.Content>
                </CatalogFilterLayout>
              </Content>
            </Paper>
          </Container>
        </Box>
      </Page>
    </EntityListProvider>
  );
};

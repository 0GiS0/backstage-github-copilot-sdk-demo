/**
 * Custom Copilot SDK tools that call the internal Backstage Catalog REST API.
 *
 * These tools give the Copilot agent direct access to query the Software Catalog
 * without relying on the MCP server, providing a faster and more targeted experience.
 */
import { LoggerService } from '@backstage/backend-plugin-api';

const BACKSTAGE_BASE_URL = 'http://localhost:7007';
const BACKSTAGE_APP_BASE_URL = 'http://localhost:3000';

type BackstageRequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

type TemplateRefParts = {
  kind: string;
  namespace: string;
  name: string;
  entityRef: string;
};

type TemplateDefaults = Record<string, unknown>;
type CreateBackstageToolsOptions = {
  githubToken?: string;
};

// ── Lazy-load defineTool from the ESM-only SDK ──────────────────
let _defineTool: any;
async function getDefineTool(): Promise<any> {
  if (!_defineTool) {
    const sdk = await import('@github/copilot-sdk');
    _defineTool = sdk.defineTool;
  }
  return _defineTool;
}

// ── Internal helper to call Backstage APIs ──────────────────────
async function backstageRequest(
  path: string,
  logger: LoggerService,
  options: BackstageRequestOptions = {},
): Promise<any> {
  const url = `${BACKSTAGE_BASE_URL}${path}`;
  logger.info(`[tool] ${options.method ?? 'GET'} ${url}`);
  const backstageToken = process.env.BACKSTAGE_MCP_ACTIONS_TOKEN;

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      ...(backstageToken ? { Authorization: `Bearer ${backstageToken}` } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const text =
      typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
    throw new Error(`Backstage API ${response.status}: ${text}`);
  }

  return payload;
}

async function backstageFetch(
  path: string,
  logger: LoggerService,
): Promise<any> {
  return backstageRequest(path, logger);
}

async function githubRequest(
  path: string,
  logger: LoggerService,
  githubToken: string,
): Promise<Response> {
  const url = `https://api.github.com${path}`;
  logger.info(`[tool] GET ${url}`);
  return fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${githubToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'backstage-copilot-chat',
    },
  });
}

function parseTemplateRef(input: string): TemplateRefParts {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('Template reference cannot be empty');
  }

  if (trimmed.includes(':') && trimmed.includes('/')) {
    const [kindPart, rest] = trimmed.split(':', 2);
    const [namespacePart, namePart] = rest.split('/', 2);

    if (!kindPart || !namespacePart || !namePart) {
      throw new Error(
        `Invalid templateRef "${input}". Expected format template:namespace/name`,
      );
    }

    return {
      kind: kindPart,
      namespace: namespacePart,
      name: namePart,
      entityRef: `${kindPart}:${namespacePart}/${namePart}`,
    };
  }

  if (trimmed.includes('/')) {
    const [namespacePart, namePart] = trimmed.split('/', 2);
    if (!namespacePart || !namePart) {
      throw new Error(
        `Invalid template reference "${input}". Expected namespace/name or template:namespace/name`,
      );
    }

    return {
      kind: 'template',
      namespace: namespacePart,
      name: namePart,
      entityRef: `template:${namespacePart}/${namePart}`,
    };
  }

  return {
    kind: 'template',
    namespace: 'default',
    name: trimmed,
    entityRef: `template:default/${trimmed}`,
  };
}

function summarizeParameterSchema(parameters: any[] = []) {
  return parameters.flatMap((section: any, index: number) => {
    const requiredFields = new Set<string>(section?.required || []);
    const properties = section?.properties || {};

    return [
      {
        sectionTitle: section?.title || `Section ${index + 1}`,
        description: section?.description,
        fields: Object.entries(properties).map(
          ([name, definition]: [string, any]) => ({
            name,
            title: definition?.title || name,
            type: definition?.type || 'object',
            description: definition?.description,
            required: requiredFields.has(name),
            default: definition?.default,
            enum: definition?.enum,
            enumNames: definition?.enumNames,
            uiField: definition?.['ui:field'],
            uiWidget: definition?.['ui:widget'],
            uiOptions: definition?.['ui:options'],
          }),
        ),
      },
    ];
  });
}

function collectDefaultValues(parameters: any[] = []): TemplateDefaults {
  const defaults: TemplateDefaults = {};

  for (const section of parameters) {
    const properties = section?.properties || {};

    for (const [name, definition] of Object.entries(properties)) {
      if ((definition as any)?.default !== undefined) {
        defaults[name] = (definition as any).default;
      }
    }
  }

  return defaults;
}

function deriveRepoName(repoUrl: unknown): string | undefined {
  if (typeof repoUrl !== 'string' || !repoUrl.includes('?')) {
    return undefined;
  }

  const query = repoUrl.split('?', 2)[1];
  const params = new URLSearchParams(query);
  return params.get('repo') || undefined;
}

function parseRepoDestination(repoUrl: unknown) {
  if (typeof repoUrl !== 'string' || !repoUrl.includes('?')) {
    return undefined;
  }

  const query = repoUrl.split('?', 2)[1];
  const params = new URLSearchParams(query);
  const owner = params.get('owner') || undefined;
  const repo = params.get('repo') || undefined;

  if (!owner || !repo) {
    return undefined;
  }

  return { owner, repo };
}

async function checkRepoAvailability(
  repoUrl: unknown,
  logger: LoggerService,
  githubToken?: string,
) {
  const destination = parseRepoDestination(repoUrl);

  if (!destination) {
    return {
      checked: false,
      exists: false,
      owner: undefined,
      repo: undefined,
      reason: 'No valid repoUrl destination was provided',
    };
  }

  if (!githubToken) {
    return {
      checked: false,
      exists: false,
      owner: destination.owner,
      repo: destination.repo,
      reason: 'No GitHub token available for repo availability check',
    };
  }

  const response = await githubRequest(
    `/repos/${destination.owner}/${destination.repo}`,
    logger,
    githubToken,
  );

  if (response.status === 404) {
    return {
      checked: true,
      exists: false,
      owner: destination.owner,
      repo: destination.repo,
    };
  }

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(
      `GitHub API ${response.status}: ${
        payload || 'repo availability check failed'
      }`,
    );
  }

  const data = await response.json();
  return {
    checked: true,
    exists: true,
    owner: destination.owner,
    repo: destination.repo,
    repoUrl: data.html_url,
    visibility: data.private ? 'private' : 'public',
  };
}

export function applyTemplateDefaults(
  entity: any,
  values: Record<string, unknown>,
): Record<string, unknown> {
  const parameters = Array.isArray(entity.spec?.parameters)
    ? entity.spec.parameters
    : [];

  const resolvedValues: Record<string, unknown> = {
    ...collectDefaultValues(parameters),
    ...values,
  };

  if (!resolvedValues.name) {
    const derivedRepoName = deriveRepoName(resolvedValues.repoUrl);
    if (derivedRepoName) {
      resolvedValues.name = derivedRepoName;
    }
  }

  return resolvedValues;
}

function getRequiredFieldNames(parameters: any[] = []) {
  return Array.from(
    new Set(
      parameters.flatMap((section: any) =>
        Array.isArray(section?.required) ? section.required : [],
      ),
    ),
  );
}

function formatTemplateDetails(entity: any) {
  const namespace = entity.metadata?.namespace || 'default';
  const entityRef = `template:${namespace}/${entity.metadata?.name}`;
  const parameters = Array.isArray(entity.spec?.parameters)
    ? entity.spec.parameters
    : [];

  return {
    entityRef,
    name: entity.metadata?.name,
    namespace,
    title: entity.metadata?.title || entity.metadata?.name,
    description: entity.metadata?.description || 'No description',
    owner: entity.spec?.owner,
    type: entity.spec?.type,
    tags: entity.metadata?.tags || [],
    steps:
      entity.spec?.steps?.map((step: any) => ({
        id: step.id,
        name: step.name,
        action: step.action,
      })) || [],
    defaultValues: collectDefaultValues(parameters),
    requiredFields: getRequiredFieldNames(parameters),
    parameterSections: summarizeParameterSchema(parameters),
  };
}

/**
 * Creates all the custom Backstage tools for the Copilot session.
 * Must be called async because defineTool comes from an ESM module.
 */
export async function createBackstageTools(
  logger: LoggerService,
  options: CreateBackstageToolsOptions = {},
) {
  const defineTool = await getDefineTool();

  // ── 1. List / search catalog entities ─────────────────────────
  const listEntities = defineTool('backstage_list_entities', {
    description:
      'List entities in the Backstage Software Catalog. ' +
      'Can filter by kind (Component, API, Resource, System, Domain, Group, User, Template, Location), ' +
      'by type (service, website, library, etc.), and by text filter. ' +
      'Returns name, kind, type, lifecycle, owner, system, description, and tags for each entity.',
    parameters: {
      type: 'object',
      properties: {
        kind: {
          type: 'string',
          description:
            'Filter by entity kind: Component, API, Resource, System, Domain, Group, User, Template, Location',
        },
        type: {
          type: 'string',
          description:
            'Filter by entity type (for Components: service, website, library, etc.)',
        },
        filter: {
          type: 'string',
          description:
            'Additional filter string in Backstage format, e.g. "metadata.tags=java" or "spec.owner=team-a"',
        },
      },
    },
    handler: async (args: {
      kind?: string;
      type?: string;
      filter?: string;
    }) => {
      const params = new URLSearchParams();
      if (args.kind) params.append('filter', `kind=${args.kind}`);
      if (args.type) params.append('filter', `spec.type=${args.type}`);
      if (args.filter) params.append('filter', args.filter);

      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await backstageFetch(
        `/api/catalog/entities${query}`,
        logger,
      );

      logger.info(
        `[tool] backstage_list_entities returned ${data.length} entities`,
      );

      return data.map((entity: any) => ({
        name: entity.metadata?.name,
        kind: entity.kind,
        namespace: entity.metadata?.namespace || 'default',
        type: entity.spec?.type,
        lifecycle: entity.spec?.lifecycle,
        owner: entity.spec?.owner,
        system: entity.spec?.system,
        description: entity.metadata?.description || 'No description',
        tags: entity.metadata?.tags || [],
      }));
    },
  });

  // ── 2. Get entity details ─────────────────────────────────────
  const getEntity = defineTool('backstage_get_entity', {
    description:
      'Get full details of a specific entity in the Backstage Software Catalog by its kind, namespace, and name. ' +
      'Returns metadata, spec, relations, and all available information.',
    parameters: {
      type: 'object',
      properties: {
        kind: {
          type: 'string',
          description: 'The entity kind (Component, API, System, etc.)',
        },
        namespace: {
          type: 'string',
          description: 'The entity namespace (usually "default")',
        },
        name: {
          type: 'string',
          description: 'The entity name',
        },
      },
      required: ['kind', 'name'],
    },
    handler: async (args: {
      kind: string;
      namespace?: string;
      name: string;
    }) => {
      const ns = args.namespace || 'default';
      const data = await backstageFetch(
        `/api/catalog/entities/by-name/${args.kind}/${ns}/${args.name}`,
        logger,
      );

      logger.info(
        `[tool] backstage_get_entity returned ${args.kind}:${ns}/${args.name}`,
      );

      return {
        kind: data.kind,
        name: data.metadata?.name,
        namespace: data.metadata?.namespace,
        description: data.metadata?.description,
        annotations: data.metadata?.annotations,
        labels: data.metadata?.labels,
        tags: data.metadata?.tags,
        links: data.metadata?.links,
        spec: data.spec,
        relations: data.relations,
      };
    },
  });

  // ── 3. List software templates ────────────────────────────────
  const listTemplates = defineTool('backstage_list_templates', {
    description:
      'List all Software Templates available in the Backstage catalog. ' +
      'Software Templates are used to scaffold new projects, services, or components. ' +
      'Returns the template name, title, description, and tags.',
    parameters: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      const data = await backstageFetch(
        '/api/catalog/entities?filter=kind=Template',
        logger,
      );

      logger.info(
        `[tool] backstage_list_templates returned ${data.length} templates`,
      );

      return data.map((entity: any) => ({
        entityRef: `template:${entity.metadata?.namespace || 'default'}/${
          entity.metadata?.name
        }`,
        name: entity.metadata?.name,
        title: entity.metadata?.title || entity.metadata?.name,
        description: entity.metadata?.description || 'No description',
        tags: entity.metadata?.tags || [],
        owner: entity.spec?.owner,
        type: entity.spec?.type,
        steps: entity.spec?.steps?.length ?? 0,
        parameters:
          entity.spec?.parameters?.map((p: any) => p.title).filter(Boolean) ||
          [],
      }));
    },
  });

  // ── 4. Get full template details & parameter schema ──────────
  const getTemplateDetails = defineTool('backstage_get_template_details', {
    description:
      'Get the full details of a Backstage Software Template, including its required parameters, field descriptions, enum choices, and scaffolder steps. ' +
      'Use this before creating a project from chat so you can ask the user only for missing required values.',
    parameters: {
      type: 'object',
      properties: {
        templateRef: {
          type: 'string',
          description:
            'Template entity reference. Accepts template:namespace/name, namespace/name, or just the template name.',
        },
      },
      required: ['templateRef'],
    },
    handler: async (args: { templateRef: string }) => {
      const template = parseTemplateRef(args.templateRef);
      const entity = await backstageFetch(
        `/api/catalog/entities/by-name/${template.kind}/${template.namespace}/${template.name}`,
        logger,
      );

      logger.info(
        `[tool] backstage_get_template_details returned ${template.entityRef}`,
      );

      return formatTemplateDetails(entity);
    },
  });

  const checkRepoAvailabilityTool = defineTool(
    'github_check_repo_availability',
    {
      description:
        'Check whether the GitHub repository described by a Backstage repoUrl already exists. ' +
        'Use this before launching a Software Template so you can stop early if the name is already taken.',
      parameters: {
        type: 'object',
        properties: {
          repoUrl: {
            type: 'string',
            description:
              'Repository destination in Backstage RepoUrlPicker format, for example github.com?owner=ORG&repo=NAME',
          },
        },
        required: ['repoUrl'],
      },
      handler: async (args: { repoUrl: string }) => {
        const result = await checkRepoAvailability(
          args.repoUrl,
          logger,
          options.githubToken,
        );

        logger.info(
          `[tool] github_check_repo_availability ${result.owner || '?'} / ${
            result.repo || '?'
          } => ${result.exists ? 'exists' : 'available'}`,
        );

        return result;
      },
    },
  );

  // ── 5. Create scaffolder task ────────────────────────────────
  const createScaffolderTask = defineTool('backstage_create_scaffolder_task', {
    description:
      'Launch a Backstage Software Template by creating a scaffolder task. ' +
      'Only call this after you have collected all required values from the user and confirmed them.',
    parameters: {
      type: 'object',
      properties: {
        templateRef: {
          type: 'string',
          description:
            'Template entity reference. Accepts template:namespace/name, namespace/name, or just the template name.',
        },
        values: {
          type: 'object',
          description:
            'The parameter values to send to the scaffolder task. Keys must match the template parameter names.',
          additionalProperties: true,
        },
      },
      required: ['templateRef', 'values'],
    },
    handler: async (args: {
      templateRef: string;
      values: Record<string, unknown>;
    }) => {
      const template = parseTemplateRef(args.templateRef);
      const entity = await backstageFetch(
        `/api/catalog/entities/by-name/${template.kind}/${template.namespace}/${template.name}`,
        logger,
      );
      const resolvedValues = applyTemplateDefaults(entity, args.values);
      const repoAvailability = await checkRepoAvailability(
        resolvedValues.repoUrl,
        logger,
        options.githubToken,
      );

      if (repoAvailability.checked && repoAvailability.exists) {
        throw new Error(
          `Repository ${repoAvailability.owner}/${repoAvailability.repo} already exists on GitHub. Choose a different repo name before launching the template.`,
        );
      }

      const result = await backstageRequest(
        '/api/scaffolder/v2/tasks',
        logger,
        {
          method: 'POST',
          body: {
            templateRef: template.entityRef,
            values: resolvedValues,
          },
        },
      );

      logger.info(
        `[tool] backstage_create_scaffolder_task created ${result.id} from ${template.entityRef}`,
      );

      return {
        taskId: result.id,
        templateRef: template.entityRef,
        values: resolvedValues,
        taskPath: `/create/tasks/${result.id}`,
        taskUrl: `${BACKSTAGE_APP_BASE_URL}/create/tasks/${result.id}`,
        apiTaskUrl: `${BACKSTAGE_BASE_URL}/api/scaffolder/v2/tasks/${result.id}`,
      };
    },
  });

  // ── 6. Read scaffolder task status ───────────────────────────
  const getScaffolderTask = defineTool('backstage_get_scaffolder_task', {
    description:
      'Get the current status of a Backstage scaffolder task by task ID. ' +
      'Use this after creating a project when the user asks whether it finished or failed.',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'The Backstage scaffolder task ID',
        },
      },
      required: ['taskId'],
    },
    handler: async (args: { taskId: string }) => {
      const task = await backstageFetch(
        `/api/scaffolder/v2/tasks/${args.taskId}`,
        logger,
      );

      logger.info(
        `[tool] backstage_get_scaffolder_task returned ${args.taskId}`,
      );

      return {
        id: task.id,
        status: task.status,
        lastHeartbeatAt: task.lastHeartbeatAt,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        error: task.error,
        templateRef: task.spec?.templateInfo?.entityRef,
        taskPath: `/create/tasks/${task.id}`,
        taskUrl: `${BACKSTAGE_APP_BASE_URL}/create/tasks/${task.id}`,
      };
    },
  });

  // ── 7. Search entities ────────────────────────────────────────
  const searchEntities = defineTool('backstage_search', {
    description:
      'Full-text search across all entities, documentation (TechDocs), and other content indexed in Backstage. ' +
      'Use this when the user asks vague questions like "find everything related to payments" or "search for auth".',
    parameters: {
      type: 'object',
      properties: {
        term: {
          type: 'string',
          description: 'The search term / query',
        },
      },
      required: ['term'],
    },
    handler: async (args: { term: string }) => {
      const params = new URLSearchParams({ term: args.term });
      const data = await backstageFetch(
        `/api/search/query?${params.toString()}`,
        logger,
      );

      logger.info(
        `[tool] backstage_search for "${args.term}" returned ${
          data.results?.length ?? 0
        } results`,
      );

      return (data.results || []).slice(0, 20).map((r: any) => ({
        title: r.document?.title,
        text: r.document?.text?.slice(0, 200),
        location: r.document?.location,
        kind: r.document?.kind,
        type: r.type,
      }));
    },
  });

  // ── 8. List entity kinds summary (stats) ──────────────────────
  const catalogStats = defineTool('backstage_catalog_stats', {
    description:
      'Get a summary / overview of the Backstage catalog: how many entities of each kind exist. ' +
      'Useful when the user asks "what is in the catalog?", "give me an overview", or "how many services do we have?".',
    parameters: {
      type: 'object',
      properties: {},
    },
    handler: async () => {
      const data = await backstageFetch('/api/catalog/entities', logger);

      const counts: Record<string, number> = {};
      for (const entity of data) {
        const kind = entity.kind || 'Unknown';
        counts[kind] = (counts[kind] || 0) + 1;
      }

      logger.info(`[tool] backstage_catalog_stats: ${JSON.stringify(counts)}`);

      return {
        totalEntities: data.length,
        byKind: counts,
      };
    },
  });

  return [
    listEntities,
    getEntity,
    listTemplates,
    getTemplateDetails,
    checkRepoAvailabilityTool,
    createScaffolderTask,
    getScaffolderTask,
    searchEntities,
    catalogStats,
  ];
}

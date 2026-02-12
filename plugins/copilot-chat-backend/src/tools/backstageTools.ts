/**
 * Custom Copilot SDK tools that call the internal Backstage Catalog REST API.
 *
 * These tools give the Copilot agent direct access to query the Software Catalog
 * without relying on the MCP server, providing a faster and more targeted experience.
 */
import { LoggerService } from '@backstage/backend-plugin-api';

const BACKSTAGE_BASE_URL = 'http://localhost:7007';

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
async function backstageFetch(
  path: string,
  logger: LoggerService,
): Promise<any> {
  const url = `${BACKSTAGE_BASE_URL}${path}`;
  logger.info(`[tool] Fetching ${url}`);
  const response = await fetch(url, {
    headers: {
      Authorization: 'Bearer mcp-test-token-local-dev',
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backstage API ${response.status}: ${text}`);
  }
  return response.json();
}

/**
 * Creates all the custom Backstage tools for the Copilot session.
 * Must be called async because defineTool comes from an ESM module.
 */
export async function createBackstageTools(logger: LoggerService) {
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
        name: entity.metadata?.name,
        title: entity.metadata?.title || entity.metadata?.name,
        description: entity.metadata?.description || 'No description',
        tags: entity.metadata?.tags || [],
        type: entity.spec?.type,
        steps: entity.spec?.steps?.length ?? 0,
        parameters:
          entity.spec?.parameters?.map((p: any) => p.title).filter(Boolean) ||
          [],
      }));
    },
  });

  // ── 4. Search entities ────────────────────────────────────────
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

  // ── 5. List entity kinds summary (stats) ──────────────────────
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

  return [listEntities, getEntity, listTemplates, searchEntities, catalogStats];
}

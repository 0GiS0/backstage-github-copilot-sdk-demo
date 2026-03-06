import { applyTemplateDefaults } from './backstageTools';

describe('applyTemplateDefaults', () => {
  it('fills template defaults and derives the project name from repoUrl', () => {
    const templateEntity = {
      spec: {
        parameters: [
          {
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              system: { type: 'string' },
              serviceTier: { type: 'string', default: 'tier-3' },
              teamOwner: {
                type: 'string',
                default: 'copilot-sdk-challenge-team',
              },
              owner: { type: 'string' },
              demo: { type: 'string', default: 'yes' },
            },
          },
          {
            properties: {
              repoUrl: { type: 'string' },
            },
          },
        ],
      },
    };

    const resolved = applyTemplateDefaults(templateEntity, {
      description:
        'Astro frontend for the GitHub Copilot SDK Enterprise Challenge demo',
      system: 'meme-factory',
      repoUrl: 'github.com?owner=0GiS0&repo=winners-web',
    });

    expect(resolved).toMatchObject({
      name: 'winners-web',
      description:
        'Astro frontend for the GitHub Copilot SDK Enterprise Challenge demo',
      system: 'meme-factory',
      repoUrl: 'github.com?owner=0GiS0&repo=winners-web',
      serviceTier: 'tier-3',
      teamOwner: 'copilot-sdk-challenge-team',
      demo: 'yes',
    });

    expect(resolved.owner).toBeUndefined();
  });
});

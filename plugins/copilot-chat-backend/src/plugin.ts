import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

/**
 * copilotChatPlugin backend plugin
 *
 * @public
 */
export const copilotChatPlugin = createBackendPlugin({
  pluginId: 'copilot-chat',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
      },
      async init({ logger, httpRouter }) {
        httpRouter.use(
          await createRouter({
            logger,
          }),
        );
        // Allow unauthenticated requests — the plugin uses the user's
        // GitHub token (sent via header) instead of Backstage credentials.
        httpRouter.addAuthPolicy({
          path: '/chat',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/models',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { todoListServiceRef } from './services/TodoListService';

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
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        todoList: todoListServiceRef,
      },
      async init({ httpAuth, httpRouter, todoList }) {
        httpRouter.use(
          await createRouter({
            httpAuth,
            todoList,
          }),
        );
      },
    });
  },
});

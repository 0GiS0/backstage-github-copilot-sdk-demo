import {
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const copilotChatPlugin = createPlugin({
  id: 'copilot-chat',
  routes: {
    root: rootRouteRef,
  },
});

export const CopilotChatPage = copilotChatPlugin.provide(
  createRoutableExtension({
    name: 'CopilotChatPage',
    component: () =>
      import('./components/CopilotChatPage').then(m => m.CopilotChatPage),
    mountPoint: rootRouteRef,
  }),
);

export const CopilotChatWidget = copilotChatPlugin.provide(
  createComponentExtension({
    name: 'CopilotChatWidget',
    component: {
      lazy: () =>
        import('./components/CopilotChatWidget').then(m => m.CopilotChatWidget),
    },
  }),
);

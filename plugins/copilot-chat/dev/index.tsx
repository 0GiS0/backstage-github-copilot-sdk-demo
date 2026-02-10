import { createDevApp } from '@backstage/dev-utils';
import { copilotChatPlugin, CopilotChatPage } from '../src/plugin';

createDevApp()
  .registerPlugin(copilotChatPlugin)
  .addPage({
    element: <CopilotChatPage />,
    title: 'Root Page',
    path: '/copilot-chat',
  })
  .render();

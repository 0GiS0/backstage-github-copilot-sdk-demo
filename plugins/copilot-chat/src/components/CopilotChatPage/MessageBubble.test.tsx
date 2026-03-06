import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { MessageBubble } from './MessageBubble';

describe('MessageBubble', () => {
  it('renders assistant messages as markdown', async () => {
    await renderInTestApp(
      <MessageBubble
        message={{
          id: 'assistant-1',
          role: 'assistant',
          content:
            '# Summary\n\n- first item\n- second item\n\nVisit [Backstage](https://backstage.io).',
          timestamp: new Date('2026-03-06T12:00:00Z'),
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Summary' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Backstage' })).toHaveAttribute(
      'href',
      'https://backstage.io',
    );
  });
});

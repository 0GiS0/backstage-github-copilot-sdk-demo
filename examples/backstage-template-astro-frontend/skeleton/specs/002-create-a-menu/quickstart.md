# Quickstart: Implementing Left-side Menu with Halfmoon in Astro

## Prerequisites
- Astro project initialized
- Halfmoon CSS/JS included (via CDN or npm)

## Steps
1. Add Halfmoon CSS/JS to `src/layouts/Layout.astro` or main layout file.
2. Create a `Menu.astro` component using Halfmoon sidebar/menu classes.
3. Define menu items in a data file or as props to the component.
4. Render menu items with correct states (selected, disabled).
5. Ensure menu is vertically scrollable if items exceed available space.
6. Use Astro Islands for any interactive features (e.g., collapsible sections).
7. Test keyboard navigation and accessibility.
8. Validate with Lighthouse and screen readers.


## Example Usage
1. Ensure Halfmoon CSS is included in your layout (see Layout.astro).
2. Add the Menu component to your layout:
   ```astro
   ---
   import Menu from '../components/Menu.astro';
   ---
   <Menu />
   ```
3. Customize menu items in Menu.astro as needed.
4. The menu will appear on the left side, be vertically scrollable, and support accessibility features.
5. Disabled items are not focusable or clickable.
6. Selected item is visually highlighted.

## Developer Notes
- Test with keyboard navigation and screen readers for accessibility.
- Validate layout and menu overflow on different screen sizes.
- Use Lighthouse to check performance and accessibility scores.

## References
- Halfmoon Sidebar: https://www.gethalfmoon.com/docs/sidebar/
- Astro Islands: https://docs.astro.build/en/core-concepts/islands/

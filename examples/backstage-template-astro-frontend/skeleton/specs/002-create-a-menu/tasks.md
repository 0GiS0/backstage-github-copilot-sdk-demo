# Tasks: Left-side Menu for Website

## Task List

### T001. Setup Astro + Halfmoon
- Initialize Astro project if not already done
- Add Halfmoon CSS/JS via CDN or npm
- Ensure linting and formatting tools are configured
- Path: `/workspaces/ghec-org-as-code/templates/astro-frontend/skeleton/`

### T002. Create Data Model for Menu
- Implement data model for Menu and MenuItem entities
- Path: `specs/002-create-a-menu/data-model.md`

### T003. Implement Menu Component
- Create `Menu.astro` using Halfmoon sidebar/menu classes
- Render menu items from data model
- Path: `src/components/Menu.astro`

### T004. Integrate Menu in Layout
- Add Menu component to main layout (`src/layouts/Layout.astro`)
- Ensure left-side placement and vertical scrolling

### T005. Accessibility & Keyboard Navigation [P]
- Ensure all menu items are focusable
- Disabled items are skipped in tab order
- Test with screen readers

### T006. Implement Menu Item States [P]
- Selected state highlights active menu item
- Disabled state for items with no destination

### T007. Integration Tests [P]
- Test navigation between sections via menu
- Test menu overflow and scrolling

### T008. Polish & Documentation
- Add usage instructions to `quickstart.md`
- Validate with Lighthouse and accessibility tools
- Update documentation for developers

## Parallel Execution Guidance
- Tasks T005, T006, and T007 can be executed in parallel after T004 is complete
- Setup (T001) must be completed first
- Data model (T002) before component implementation (T003)
- Integration and polish (T008) after all core and test tasks

## Dependencies
- T001 → T002 → T003 → T004 → [T005, T006, T007] → T008

---

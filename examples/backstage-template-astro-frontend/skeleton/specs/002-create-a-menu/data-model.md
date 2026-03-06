# Data Model: Left-side Menu

## Entities

### Menu
- id: string
- items: MenuItem[]

### MenuItem
- id: string
- label: string
- destination: string | null
- selected: boolean
- disabled: boolean

## Relationships
- Menu contains multiple MenuItems
- MenuItem may have a destination (URL or section anchor)
- MenuItem may be selected or disabled

## Notes
- The menu is rendered on the left side of the page
- Items without a destination are disabled
- Menu supports vertical scrolling if items exceed available space

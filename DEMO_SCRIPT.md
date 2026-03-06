# Demo Script

## Goal

Show the Backstage demo as a coherent product experience:

1. Start on the Home page.
2. Move to the Catalog and ask Copilot what entities exist.
3. Open a specific entity and ask what Copilot can tell you about it.
4. Go to Create, briefly show the template assistant entry point.
5. Re-open Copilot Chat and ask it to create a new Astro website called `winners-web`.

## Suggested Recording Flow

### 1. Start on Home

Open the demo on the Home page and give a short introduction.

Suggested narration:

> This demo shows a Backstage portal powered by GitHub Copilot, with a complete catalog, documented entities, and guided software creation flows.

Pause briefly so the Home page is clearly visible.

### 2. Move to the Catalog

Navigate from Home to the Catalog.

Once the Catalog page is visible, open Copilot Chat and ask:

> What entities do we have in this catalog?

Suggested follow-up narration:

> Copilot can inspect the catalog and explain the different entities that are available in the demo, such as systems, components, APIs, resources, groups, and templates.

Give it a moment so the response can be read on screen.

### 3. Open a Specific Entity

Open one concrete entity from the Catalog. A good option is the `meme-factory` system, but any well-populated entity page works.

With that entity page open, ask Copilot:

> What can you tell me about this entity?

Suggested narration:

> Here Copilot can explain ownership, relationships, documentation, dependencies, and the purpose of the selected entity directly from the Backstage context.

If the response mentions docs, owner, system relationships, APIs, or linked components, let that stay on screen for a second.

### 4. Go to Create

Navigate to the Create section.

Open one template so the creation wizard is visible. The goal here is just to show that the template flow has an assistant-friendly experience.

Suggested narration:

> In the Create area, every template is ready to be launched manually, but it can also be driven through Copilot.

Click once so the assistant presence in the create flow is visible, but do not continue manually through the form.

### 5. Re-open Copilot Chat from Create

Click the chat button again so Copilot Chat becomes the main interaction path.

Ask Copilot:

> Create a new Astro website called winners-web.

Suggested narration:

> Instead of filling the template by hand, I can ask Copilot to guide or initiate the creation flow in natural language. In this case, I want a new Astro frontend called winners-web.

Let the request and response remain visible long enough to show the natural-language driven workflow.

## Short Prompt List

Use these exact prompts during the recording if you want a clean, repeatable flow:

1. `What entities do we have in this catalog?`
2. `What can you tell me about this entity?`
3. `Create a new Astro website called winners-web.`

## Recommended Entity Choice

If you want a consistent entity for the middle part of the demo, use:

- `meme-factory` for the system view
- `meme-factory-web` for a frontend component view
- `meme-factory-http-api` for an API view

The `meme-factory` system is the safest default because it gives Copilot enough context to talk about ownership, related components, and documentation.

## Recording Notes

- Keep the Home page on screen for a moment before navigating.
- In Catalog, wait for Copilot's answer before switching pages.
- On the entity page, leave enough time for the answer to highlight links, ownership, and relationships.
- In Create, avoid filling the form manually after opening the template.
- Use the final Astro request as the natural-language handoff moment.

## One-Line Version

If you want a very short spoken version:

> We start on Home, move to the Catalog and ask Copilot what entities exist, open one entity and ask what it knows about it, then go to Create and instead of filling a template manually, we ask Copilot to create a new Astro website called winners-web.
# TODO List Application

A TODO list application built with **Quasar v2** (Vue 3), **TypeScript**, **Pinia**, and **Cypress**, backed by a [Serverless REST API](https://github.com/ianaquino47/todo-api) with DynamoDB persistence and MCP integration for AI assistants.

## Features

- **Add** TODO items via text input
- **Complete** TODOs with a checkbox (strikethrough styling)
- **Edit** TODOs inline — click the pencil icon, press Enter to confirm or Escape to cancel
- **Delete** TODOs with the delete button
- **Filter** by All / Active / Completed
- **Clear completed** TODOs in one click
- **API-backed persistence** — TODOs are stored in DynamoDB via the todo-api, surviving page reloads and across devices
- **Optimistic updates** — UI updates instantly, reverts automatically on API failure
- **AI-accessible** — TODOs can also be managed via Claude through the [MCP server](https://github.com/ianaquino47/todo-api#mcp-server)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) (Composition API) |
| UI | [Quasar v2](https://quasar.dev/) |
| State | [Pinia](https://pinia.vuejs.org/) |
| Language | TypeScript |
| i18n | [vue-i18n](https://vue-i18n.intlify.dev/) (en-GB) |
| API | [todo-api](https://github.com/ianaquino47/todo-api) (Serverless + DynamoDB + MCP) |
| Unit/Component Tests | [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) |
| E2E Tests | [Cypress](https://www.cypress.io/) |

## Project Structure

```
src/
├── boot/               # Pinia and i18n initialisation
├── components/         # UI components (TodoInput, TodoItem, TodoList, TodoFilters)
│   └── __tests__/      # Component tests (Vitest)
├── css/                # Global styles
├── domain/             # ITodo interface, TodoFilter enum
├── i18n/en-GB/         # Translation keys
├── layouts/            # MainLayout (header + page container)
├── pages/              # IndexPage (composes all components, loads todos on mount)
├── router/             # Vue Router config
├── services/           # API client (todoApi.ts)
└── stores/             # Pinia todo store (API-backed with optimistic updates)
    └── __tests__/      # Store unit tests (Vitest)

test/cypress/
├── e2e/                # E2E test specs
└── support/            # Custom commands (cy.dataCy)
```

## Getting Started

### Prerequisites

- **Node.js** v20+
- **npm** v10+
- **todo-api** deployed (see [todo-api README](https://github.com/ianaquino47/todo-api))

### Install

```bash
npm install
```

### Development

```bash
npx quasar dev
```

Opens at [http://localhost:9000](http://localhost:9000). Todos are loaded from the API on page load.

### Build for Production

```bash
npx quasar build
```

Output is in `dist/spa/`.

## Data Flow

```
User action → Pinia store (optimistic update) → API call (background)
                                                      │
                                               ┌──────┴──────┐
                                               │  Success     │  Failure
                                               │  (no-op)     │  (revert local state,
                                               └──────────────┘   set error message)
```

1. **On mount**: `IndexPage` calls `store.loadTodos()` to fetch all todos from the API
2. **On mutation**: The store optimistically updates local state, then fires the API call in the background
3. **On failure**: Local state is reverted to its previous value and `store.error` is set

## Testing

### Unit & Component Tests

```bash
npm run test:unit
```

Runs 63 tests across 5 test suites covering:

- **Store** (29 tests) — all actions, computed properties, API integration, optimistic updates, error revert
- **TodoInput** (7 tests) — add via Enter/button, trim, empty validation
- **TodoItem** (13 tests) — toggle, delete, inline edit, escape cancel, completed styling
- **TodoFilters** (8 tests) — filter buttons, clear completed, remaining count
- **TodoList** (6 tests) — rendering, empty state, event propagation

### E2E Tests

With the dev server running in one terminal:

```bash
# Headless
npx cypress run --e2e

# Interactive UI
npx cypress open --e2e
```

10 user journey tests covering:

1. Add a TODO
2. View multiple TODOs
3. Complete a TODO
4. Edit a TODO (confirm)
5. Edit a TODO (cancel with Escape)
6. Remove a TODO
7. Filter by All / Active / Completed
8. Clear completed
9. Persistence across page reloads
10. Empty input validation

## Internationalisation

All user-facing strings use vue-i18n with the `en-GB` locale. Translation keys are in `src/i18n/en-GB/index.ts` and follow the pattern:

- `UI.Labels.*` — headings, placeholders, filter labels
- `UI.Actions.*` — button labels
- `UI.Information.*` — empty states, status messages
- `UI.Errors.*` — validation messages

## Related Repositories

| Repository | Description |
|------------|-------------|
| [todo-api](https://github.com/ianaquino47/todo-api) | Serverless REST API + MCP server with DynamoDB persistence |

## Licence

ISC

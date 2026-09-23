# FlowBoard

A calm, focused personal Kanban board — capture tasks, move them across Todo → In Progress → Completed, and see your day at a glance.

**[Live demo](https://<your-username>.github.io/flowboard/)**

## Features
- Create, edit, delete (with Undo), and view task details
- Priority, due dates, tags, and creation/update timestamps
- Search, filter (priority, due today, overdue, completed), and sort
- Drag-and-drop between columns on desktop
- Dedicated mobile layout with tabbed columns
- Light, dark, and system theme
- Export/import your data as JSON, and a guarded "clear all data" action
- Handles storage failures and corrupted saved data gracefully, rather than silently losing tasks
- Keyboard accessible: full tab order, focus-visible states, arrow-key menu navigation, a skip link

## Tech stack
Plain HTML, CSS, and JavaScript (ES modules) — no frameworks, no build step. Data is stored in the browser via `localStorage`.

## Running locally
This project uses ES modules, so it needs to be served over HTTP rather than opened directly as a file.

```bash
git clone https://github.com/<your-username>/flowboard.git
cd flowboard
python3 -m http.server 5500
# then open http://localhost:5500
```
(Or use the VS Code "Live Server" extension.)

## Project structure
```
flowboard/
├── index.html
├── css/
│   ├── tokens.css       # design tokens (colors, spacing, radius) incl. dark mode
│   ├── base.css         # reset + global focus styles
│   └── components.css   # every component's styles
└── js/
    ├── main.js          # wires everything together, delegated click handling
    ├── tasks.js         # single source of truth: create/update/delete/move
    ├── storage.js       # localStorage read/write, corruption detection
    ├── render.js        # state → DOM, called after every change
    ├── query.js         # search/filter/sort logic
    ├── modal.js         # create/edit task form
    ├── details.js       # task details view
    ├── menu.js          # per-card "⋯" action menu
    ├── delete.js        # delete + undo
    ├── search.js, filters.js  # toolbar wiring
    ├── dragdrop.js      # desktop drag-and-drop
    ├── tabs.js          # mobile column tabs
    ├── theme.js         # light/dark/system theme
    ├── settings.js      # export/import/clear data
    ├── toast.js         # toast notifications
    └── utils.js         # small shared helpers
```

## What I'd highlight in an interview
- **State → render pattern:** the UI is never edited directly. Every change updates the `tasks` array, then a single `render()` rebuilds the screen from it.
- **One `persist()` function:** create, update, delete, import, and clear all funnel through it, so storage-failure tracking and the "last updated" timestamp only had to be written once.
- **Graceful degradation:** if `localStorage` is unavailable or its contents are corrupted, the app says so and offers recovery, instead of silently failing or losing data.
- **Accessibility built in, not bolted on:** delegated event handling made it straightforward to keep ARIA attributes (`aria-expanded`, `aria-pressed`, `aria-selected`) in sync with the UI on every re-render.

## Known simplifications
- Tags are entered as a comma-separated field rather than a chip input.
- Implements a practical subset of the original 15-screen design spec — this is a personal/portfolio tool, not a production SaaS product.
# Form Builder MVP - Progress Notes

Context for future sessions about the Form Builder MVP built with React, Vite, Mantine, dnd-kit, and react-hook-form.

## Current state
- Project scaffolded via Vite React TS. Mantine provider added globally (`src/main.tsx`), and base styling adjusted (`src/index.css`, `src/App.css`).
- Schema types live in `src/types/formSchema.ts` with helper `createId`.
- Central state via `FormBuilderProvider` (`src/context/FormBuilderContext.tsx`) using a reducer: schema state, selection state, add/update/remove helpers, and reorder rows/fields.
- Main page `src/pages/FormBuilderPage.tsx` wires Mantine `AppShell`, preview modal, and initial schema (one section with sample fields).
- Builder UI components in `src/components/builder/`:
  - `BuilderHeader`: form name input, Save to localStorage, Preview button.
  - `BuilderBody`: three-column layout (palette, canvas, properties).
  - `PalettePanel`: buttons to add fields (type-based), rows, sections targeting current selection.
  - `CanvasPanel`: renders form/sections/rows/columns/fields; click to select; dnd-kit to reorder rows within a section and fields within a column; add/remove row/section/field actions; form-level card for form selection.
  - `PropertiesPanel`: edits form/section/field properties based on selection.
- Form rendering stub implemented in `src/components/renderer/FormRenderer.tsx` using react-hook-form; used in preview modal.

## Outstanding / risks
- Node version warning: current Node 18.19.1 while Vite 7 expects >=20.19. Upgrade Node to avoid engine warnings.
- Palette drag-to-canvas not implemented yet; currently click-to-add into inferred column.
- No persistence beyond optional localStorage save (manual).
- Validation rules beyond basic wiring not exposed in UI.

## How to run
- Install deps (already installed). Start dev server: `npm run dev`.
- Build works (`npm run build`) but emits Node version warning noted above.***

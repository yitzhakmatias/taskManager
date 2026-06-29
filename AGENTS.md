# AGENTS.md

## Repo State
- This is a Vite React + TypeScript Task Manager created from `Actividad_Task_Manager_React_TypeScript.pdf`.
- Keep the PDF as the assignment source of truth if requirements are unclear.

## Assignment Target
- Build/complete a Vite React + TypeScript Task Manager that can be shown with `npm run dev`.
- Expected source layout is `src/App.tsx`, `src/App.css`, `src/index.css`, `src/main.tsx`, `src/vite-env.d.ts`, and `src/components/`.
- Required components in `src/components/`: `Header.tsx`, `TaskInput.tsx`, `TaskList.tsx`, `TaskCard.tsx`, `EmptyState.tsx`, `Footer.tsx`.

## Required Behavior
- `App.tsx` owns the task state with `type Task = { id: number; text: string; completed: boolean }`.
- Initial tasks are `Estudiar React`, `Practicar TypeScript`, and completed `Entender estado`.
- Implement add, delete, and toggle-completed behavior in `App.tsx`; pass handlers through props.
- `TaskList` renders `EmptyState` when there are no tasks and renders `TaskCard` items otherwise.
- `Footer` displays total, completed, and pending task counts.

## Styling Requirements
- Use `src/index.css` and `src/App.css`; component CSS files are optional.
- The app should be centered, card-like, consistently spaced, with clean inputs, visible buttons, and visually distinct completed tasks.
- Completed task text should be line-through and gray or equivalent.

## Commands
- `npm run dev` starts the Vite dev server for classroom/demo use.
- `npm run build` runs `tsc -b && vite build`; use it as the current verification command.
- No test or lint scripts are currently defined in `package.json`.

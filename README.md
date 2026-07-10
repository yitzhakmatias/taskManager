# Task Manager — React + TypeScript + Express/Prisma

<!-- BADGE_CI -->

Classroom assignment (`app/Actividad_Task_Manager_React_TypeScript.pdf`) implementing a task
manager with user authentication. The repo has two independent npm projects:

- **`app/`** — Vite + React + TypeScript frontend (Material UI).
- **`backend/`** — Express + Prisma (PostgreSQL) REST API, layered as domain / application /
  infrastructure.

There is no root `package.json`; run all npm commands from inside `app/` or `backend/`.

## How it works

1. On load, `App.tsx` has no token, so it renders `LoginPage`, which lets a user log in or
   register (`POST /login`, `POST /register`).
2. On successful login the backend returns a JWT; `App.tsx` stores it in memory (`useState`)
   and passes it to every subsequent API call.
3. Once authenticated, `App.tsx` fetches the user's tasks (`GET /tasks`) and renders
   `Header` → `TaskInput` → `TaskList` → `Footer`. `TaskList` shows `EmptyState` when there are
   no tasks, otherwise a `TaskCard` per task.
4. Adding, toggling, and deleting a task call `POST /tasks`, `PUT /tasks/:id`, and
   `DELETE /tasks/:id` respectively (all requiring the `Authorization: Bearer <token>` header);
   `App.tsx` updates its local state from each response.
5. On the backend, `requireAuth` middleware verifies the JWT on every `/tasks` route and
   attaches `req.userId`. Passwords are hashed with bcrypt; login/register issue JWTs signed
   with `JWT_SECRET`.

## Project structure

```
app/
  src/
    components/       Header, TaskInput, TaskList, TaskCard, EmptyState, Footer, LoginPage
    services/
      taskService.ts   Only place that talks to the API (login, register, getTasks, createTask, toggleTask, deleteTask)
    App.tsx            Owns all task/auth state
  local.settings.json  { "apiBaseUrl": "http://localhost:3000" } (gitignored)

backend/
  prisma/
    schema.prisma      Role, User, Task models
    seed.ts            Creates an "admin" role and an admin@test.com / 123456 test user
  src/
    domain/            Entities and repository ports (Task, User)
    application/
      auth/             login, register, get-profile use cases
      task/             get/create/update/delete task use cases
    infrastructure/
      database/         Prisma repository implementations
      http/             Express routers (auth.router.ts, task.router.ts) and auth.middleware.ts
    index.ts            Composition root / server entry point (src/index1.ts is a stray scratch file, unused)
  .env                  DATABASE_URL, JWT_SECRET
```

## Running locally

### Backend (`backend/`)
```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run seed   # creates admin@test.com / 123456
npm run dev    # http://localhost:3000
```

### Frontend (`app/`)
```bash
npm install
npm run dev    # http://localhost:5173 (or next free port)
```

Create `app/local.settings.json` with `{ "apiBaseUrl": "http://localhost:3000" }` if it doesn't
exist yet.

## API endpoints

| Method | Path       | Auth | Description                  |
|--------|-----------|------|-------------------------------|
| POST   | /register | No   | Create a user                 |
| POST   | /login    | No   | Returns `{ message, token }`  |
| GET    | /profile  | Yes  | Decoded JWT payload           |
| GET    | /tasks    | Yes  | List the caller's tasks       |
| POST   | /tasks    | Yes  | Create a task                 |
| PUT    | /tasks/:id| Yes  | Update a task (text/completed)|
| DELETE | /tasks/:id| Yes  | Delete a task                 |

## Comandos disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Levanta el entorno de desarrollo |
| `npm run build` | Genera el build de produccion |
| `npm run seed` | Crea usuarios y datos de prueba en la base de datos |
| `npm test` | Pruebas automatizadas (pendiente — Sesion 3) |

## Base de datos

PostgreSQL con migraciones y seeds gestionados con Prisma (ver backend/prisma/). Hosted en Neon (produccion) o PostgreSQL local (desarrollo).

### Variables de entorno

Crea un archivo `.env` en `backend/` con las siguientes claves (sin valores reales en este documento):

```
DATABASE_URL=
JWT_SECRET=
PORT=
```

## Verification

- Frontend: `npm run build` in `app/` (`tsc -b && vite build`)
- Backend: `npm run build` in `backend/` (`tsc`)

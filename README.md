# QuizBench

A multiple-choice Q&A app built with **Next.js (App Router)**, **Prisma** (SQLite), and **Tailwind CSS**.

- Admin panel to create, edit, and delete questions (options A–D, one correct answer)
- Public quiz flow that steps through questions and submits answers
- Automatic scoring, with results saved to the database and a shareable result page
- Recent-attempts list in the admin dashboard

## 1. Install dependencies

```bash
yarn install
```

`yarn install` runs `prisma generate` automatically via the `postinstall` script. If it doesn't
run (e.g. offline installs), run it manually:

```bash
yarn prisma generate
```

> **Note:** this project was scaffolded in a sandboxed environment that could not reach
> `binaries.prisma.sh` to download Prisma's engine binaries, so `prisma generate` / `db push`
> could not be run there. The schema validates correctly (Prisma 7's config system, driver
> adapter, and Postgres provider are all wired up) — just run the commands below on your own
> machine with normal internet access.

## 2. Create the database in pgAdmin

1. Open pgAdmin and connect to your local Postgres server (default user is usually `postgres`).
2. Right-click **Databases** → **Create** → **Database…**
3. Name it `quizapp` (or anything — just match it in `.env` below) and save.
4. In `.env`, set `DATABASE_URL` to match that server/database/credentials, e.g.:

   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/quizapp?schema=public"
   ```

   Use the same host/port/username/password you use to log into pgAdmin. If Postgres is running
   on a non-default port (pgAdmin shows this under the server's **Properties → Connection** tab),
   update `5432` accordingly.

Create the tables from the Prisma schema:

```bash
yarn db:push
```

Seed a handful of sample questions (optional but recommended for a first look):

```bash
yarn db:seed
```

You can now browse the tables either in pgAdmin directly, or with:

```bash
yarn db:studio
```

## 3. Run the app

```bash
yarn dev
```

- `/` — home page with quick stats
- `/quiz` — take the quiz, one question at a time, with instant scoring on submit
- `/quiz/result/[id]` — score + answer breakdown for a specific attempt
- `/admin` — manage questions and view recent attempts
- `/admin/questions/new` / `/admin/questions/[id]/edit` — add or edit a question

## Other useful commands

```bash
yarn db:studio    # open Prisma Studio to browse/edit data visually
yarn build        # production build
yarn start         # run the production build
```

## Project structure

```
prisma.config.ts     # Prisma 7 config: schema path, migrations, datasource URL
prisma/
  schema.prisma       # Question, Attempt, Answer models (Postgres)
  seed.ts             # sample question seeder
src/
  lib/prisma.ts        # Prisma client singleton
  components/          # Nav, QuizRunner, QuestionForm, DeleteQuestionButton
  app/
    page.tsx            # home
    quiz/                # quiz-taking flow
    admin/               # admin dashboard + question forms
    api/
      questions/          # GET/POST list, GET/PUT/DELETE by id
      attempts/            # POST submit + score, GET list/detail
```

## Notes on scoring

The correct answer is never sent to the browser while a quiz is in progress — the `/quiz` page
only fetches question text and options. Scoring happens server-side in
`POST /api/attempts`, which compares submitted answers against the database and stores an
`Attempt` with per-question `Answer` rows for the result page.

## Notes on Prisma 7

This project uses Prisma ORM 7, which changed two things from earlier versions:

- The database connection `url` can no longer live in `prisma/schema.prisma` — it's set in
  `prisma.config.ts` (used by the CLI for `db push`, `studio`, etc.) and passed directly to
  `PrismaClient` at runtime via `src/lib/prisma.ts` / `prisma/seed.ts`.
- `PrismaClient` now requires a driver adapter — this project uses `@prisma/adapter-pg` with
  the `pg` package for Postgres.

import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // The Prisma CLI (migrate, db push, studio, seed) needs a direct connection —
    // poolers like Supabase's Supavisor/PgBouncer don't support what the schema
    // engine needs. The app's runtime connection (src/lib/prisma.ts) uses the
    // pooled DATABASE_URL instead, via the driver adapter.
    url: env("DIRECT_URL"),
  },
});

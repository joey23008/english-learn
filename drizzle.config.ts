import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infra/db//schema.ts',
  out: './src/infra/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql, eq, and, or } from 'drizzle-orm';
export { sql, eq, and, or };
import pg from 'pg';
import { cwd } from 'node:process';
import { loadEnvConfig } from '@next/env';

import * as schema from './schema';

export const tables = schema;

loadEnvConfig(cwd());

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
(async () => {
  await client.connect();
})();

export function getDrizzleClient() {
  (async () => {
    await client.query("SET timezone TO 'Asia/Tokyo';");
  })();
  return drizzle(client, { schema });
};

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// DATABASE_URL must be set in .env.local
// Example: postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });

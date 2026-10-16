import { Pool, QueryResult, QueryResultRow } from "pg";

// Create singleton pool for Next.js hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var __prepforge_pg_pool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL || "postgresql://localhost:5432/prepforge";

export const pool: Pool =
  global.__prepforge_pg_pool ||
  new Pool({
    connectionString,
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl:
      process.env.NODE_ENV === "production" && !connectionString.includes("localhost")
        ? { rejectUnauthorized: false }
        : false
  });

if (process.env.NODE_ENV !== "production") {
  global.__prepforge_pg_pool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development" && duration > 1000) {
      console.warn(`[Slow Query] ${duration}ms: ${text.slice(0, 80)}`);
    }
    return res;
  } catch (error) {
    console.error("[Database Query Error]", error, { text, params });
    throw error;
  }
}

export default pool;

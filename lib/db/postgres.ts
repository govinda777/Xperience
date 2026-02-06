import { sql } from "@vercel/postgres";

// We can export 'sql' directly or wrap it if we need custom logic later.
// For now, exporting directly is sufficient for Vercel Serverless.
export { sql };

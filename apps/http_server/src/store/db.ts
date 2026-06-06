import "dotenv/config";
import { Pool } from "pg";

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.log("dbUrl is undefined");
}

export const pgPool = new Pool({ connectionString: dbUrl });

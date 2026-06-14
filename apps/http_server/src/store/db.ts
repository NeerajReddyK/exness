import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// for tiemscaledb
const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.log("dbUrl is undefined");
}

export const pgPool = new Pool({ connectionString: dbUrl });

// for user db
const connectionString = `${process.env.DB_URL_USER}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

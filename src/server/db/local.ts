import { env } from "@/env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let connection = null;
if (env.DATABASE_USE_LOCAL === "true") {
  connection = mysql.createPool(env.DATABASE_LOCAL_URL);
}

export const db = connection
  ? drizzle(connection, { schema, mode: "default" })
  : null;

import { env } from "@/env";
import { db as planetscaleDb } from "./planetscale";
import { db as localDb } from "./local";

export const db =
  // env.DATABASE_USE_LOCAL === "true" && localDb ? localDb :
  planetscaleDb;

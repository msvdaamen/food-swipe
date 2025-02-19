import { pgStatStatements } from "@food-swipe/database";
import { Hono } from "hono";
import { databaseProvider } from "../../../providers/database.provider";
import { desc, eq } from "drizzle-orm";
import { pgView, integer, text } from "drizzle-orm/pg-core";

const app = new Hono();

app.get("/", async (c) => {
  const result = await databaseProvider
    .select({
      queryid: pgStatStatements.queryid,
      query: pgStatStatements.query,
      calls: pgStatStatements.calls,
      totalExecTime: pgStatStatements.totalExecTime,
      rows: pgStatStatements.rows,
      user: pgRoles.rolname,
    })
    .from(pgStatStatements)
    .innerJoin(pgRoles, eq(pgStatStatements.userid, pgRoles.oid))
    .orderBy(desc(pgStatStatements.totalExecTime));
  return c.json(result);
});

export function registerQueryLogController(instance: Hono) {
  instance.route("/query-logs", app);
}

const pgRoles = pgView("pg_roles", {
  oid: integer("oid"),
  rolname: text("rolname"),
}).existing();

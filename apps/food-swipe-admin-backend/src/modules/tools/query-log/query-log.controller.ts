import { pgStatStatements } from "@food-swipe/database";
import { Hono } from "hono";
import { databaseProvider } from "../../../providers/database.provider";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { pgView, integer, text } from "drizzle-orm/pg-core";
import { getQueryLogsDto } from "./dto/get-query-logs.dto";
import { cacheProvider } from "../../../providers/cache.provider";
import { authRouter } from "../../auth/auth.controller";

const app = authRouter.createApp();

app.get("/", async (c) => {
  const { sort } = getQueryLogsDto.parse(c.req.query());

  const cacheKey = `query-logs:${sort}`;
  const cached = await cacheProvider.get<PgStatStatements[]>(cacheKey);
  if (cached) {
    console.log(cached);
    return c.json(cached);
  }

  const result = await databaseProvider
    .select({
      queryid: pgStatStatements.queryid,
      query: pgStatStatements.query,
      calls: pgStatStatements.calls,
      totalExecTime: pgStatStatements.totalExecTime,
      rows: pgStatStatements.rows,
      user: pgRoles.rolname,
      maxExecTime: pgStatStatements.maxExecTime,
      minExecTime: pgStatStatements.minExecTime,
      meanExecTime: pgStatStatements.meanExecTime,
    })
    .from(pgStatStatements)
    .innerJoin(pgRoles, eq(pgStatStatements.userid, pgRoles.oid))
    .orderBy(desc(getSortColumn(sort)))
    .limit(20);

  await cacheProvider.set(cacheKey, result, 1000 * 10);

  return c.json(result);
});

type PgStatStatements = typeof pgStatStatements.$inferSelect;

function getSortColumn(
  sort: keyof Pick<PgStatStatements, "totalExecTime" | "calls" | "maxExecTime">
) {
  switch (sort) {
    case "totalExecTime":
      return pgStatStatements.totalExecTime;
    case "calls":
      return pgStatStatements.calls;
    case "maxExecTime":
      return pgStatStatements.maxExecTime;
  }
  return pgStatStatements.totalExecTime;
}

export function registerQueryLogController(instance: Hono<any>) {
  instance.route("/query-logs", app);
}

const pgRoles = pgView("pg_roles", {
  oid: integer("oid"),
  rolname: text("rolname"),
}).existing();

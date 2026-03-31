import type { Hono } from "hono";
import type { AppContext } from "../../app-context";
import { endOfMonth, startOfMonth, sub } from "date-fns";
import { sValidator } from "@hono/standard-validator";
import { authRouterFactory } from "../auth/router";
import { getUsersDto } from "./dto/get-users.dto";
import { kvStorage } from "../../providers/kvstore.provider";
import { createUserService } from "./service";
import { matchError, Result } from "better-result";

const app = authRouterFactory.createApp();

app.get("/", sValidator("query", getUsersDto), async (c) => {
  const userService = createUserService(c.get("db"), kvStorage, c.get("storage"));
  const payload = c.req.valid("query");
  const result = await userService.getUsers(payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.get("/stats", async (c) => {
  const userService = createUserService(c.get("db"), kvStorage, c.get("storage"));
  const thisMonthStart = startOfMonth(new Date());
  const thisMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(sub(thisMonthStart, { months: 1 }));
  const lastMonthEnd = endOfMonth(sub(thisMonthStart, { months: 1 }));

  const result = await Result.gen(async function* () {
    const nowStats = yield* Result.await(userService.getStats(thisMonthStart, thisMonthEnd));
    const lastMonthStats = yield* Result.await(userService.getStats(lastMonthStart, lastMonthEnd));
    return Result.ok({ nowStats, lastMonthStats });
  });

  if (result.isErr()) {
    return c.status(500);
  }

  const { nowStats, lastMonthStats } = result.value;

  return c.json({
    total: nowStats.total,
    active: nowStats.active,
    new: nowStats.new,
    totalLastMonth: lastMonthStats.total,
    activeLastMonth: lastMonthStats.active,
    newLastMonth: lastMonthStats.new,
  });
});

export const userRouter = app;

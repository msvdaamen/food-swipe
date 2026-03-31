import { endOfMonth, startOfMonth, sub } from "date-fns";
import { sValidator } from "@hono/standard-validator";
import { authRouterFactory } from "../auth/router";
import { getUsersDto } from "./dto/get-users.dto";
import { kvStorage } from "../../providers/kvstore.provider";
import { createUserService } from "./service";

const app = authRouterFactory.createApp();

app.get("/", sValidator("query", getUsersDto), async (c) => {
  const userService = createUserService(c.get("db"), kvStorage, c.get("storage"));
  const payload = c.req.valid("query");
  try {
    const data = await userService.getUsers(payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.get("/stats", async (c) => {
  const userService = createUserService(c.get("db"), kvStorage, c.get("storage"));
  const thisMonthStart = startOfMonth(new Date());
  const thisMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(sub(thisMonthStart, { months: 1 }));
  const lastMonthEnd = endOfMonth(sub(thisMonthStart, { months: 1 }));

  try {
    const [nowStats, lastMonthStats] = await Promise.all([
      userService.getStats(thisMonthStart, thisMonthEnd),
      userService.getStats(lastMonthStart, lastMonthEnd)
    ]);

    return c.json({
      total: nowStats.total,
      active: nowStats.active,
      new: nowStats.new,
      totalLastMonth: lastMonthStats.total,
      activeLastMonth: lastMonthStats.active,
      newLastMonth: lastMonthStats.new
    });
  } catch {
    return c.status(500);
  }
});

export const userRouter = app;

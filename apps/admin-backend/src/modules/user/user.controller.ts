import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller.ts";
import { userService } from "./user.service.ts";
import { endOfMonth, startOfMonth, sub } from "date-fns";
import { getUsersDto } from "./dto/get-users.dto.ts";

const app = authRouter.createApp();

app.get("/", async (c) => {
  const payload = getUsersDto.parse(c.req.query());
  const result = await userService.getUsers(payload);
  return c.json(result);
});

app.get("/stats", async (c) => {
  const thisMonthStart = startOfMonth(new Date());
  const thisMonthEnd = endOfMonth(new Date());
  const lastMonthStart = startOfMonth(sub(thisMonthStart, { months: 1 }));
  const lastMonthEnd = endOfMonth(sub(thisMonthStart, { months: 1 }));
  const [
    total,
    active,
    newUsers,
    totalLastMonth,
    activeLastMonth,
    newLastMonth,
  ] = await Promise.all([
    userService.getTotal(thisMonthStart, thisMonthEnd),
    userService.getActive(thisMonthStart, thisMonthEnd),
    userService.getNew(thisMonthStart, thisMonthEnd),
    userService.getTotal(lastMonthStart, lastMonthEnd),
    userService.getActive(lastMonthStart, lastMonthEnd),
    userService.getNew(lastMonthStart, lastMonthEnd),
  ]);
  return c.json({
    total,
    active,
    new: newUsers,
    totalLastMonth,
    activeLastMonth,
    newLastMonth,
  });
});

export const registerUserController = (instance: Hono) => {
  instance.route("/v1/users", app);
};

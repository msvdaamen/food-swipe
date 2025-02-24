import type { Hono } from "hono";
import { authRouter } from "../auth/auth.controller.ts";
import { userService } from "./user.service.ts";
import { startOfMonth, sub } from "date-fns";
import { getUsersDto } from "./dto/get-users.dto.ts";

const app = authRouter.createApp();

app.get("/", async (c) => {
  const payload = getUsersDto.parse(c.req.query());
  const result = await userService.getUsers(payload);
  return c.json(result);
});

app.get("/stats", async (c) => {
  const thisMonth = startOfMonth(new Date());
  const lastMonth = sub(thisMonth, { months: 1 });
  const [
    total,
    active,
    newUsers,
    totalLastMonth,
    activeLastMonth,
    newLastMonth,
  ] = await Promise.all([
    userService.getTotal(thisMonth),
    userService.getActive(thisMonth),
    userService.getNew(thisMonth),
    userService.getTotal(lastMonth),
    userService.getActive(lastMonth),
    userService.getNew(lastMonth),
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

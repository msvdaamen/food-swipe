import { sValidator } from "@hono/standard-validator";
import { authRouterFactory } from "../auth/router";
import { createMeasurementDto } from "./dto/create-measurement.dto";
import { updateMeasurementDto } from "./dto/update-measurement.dto";
import { createMeasurementService } from "./service";

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const svc = createMeasurementService(c.get("db"));
  try {
    const data = await svc.all();
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.post("/", sValidator("json", createMeasurementDto), async (c) => {
  const svc = createMeasurementService(c.get("db"));
  const payload = c.req.valid("json");
  try {
    const data = await svc.create(payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.put("/:id", sValidator("json", updateMeasurementDto), async (c) => {
  const svc = createMeasurementService(c.get("db"));
  const id = Number(c.req.param("id"));
  const payload = c.req.valid("json");
  try {
    const data = await svc.update(id, payload);
    return c.json(data);
  } catch {
    return c.status(500);
  }
});

app.delete("/:id", async (c) => {
  const svc = createMeasurementService(c.get("db"));
  const id = Number(c.req.param("id"));
  try {
    await svc.delete(id);
    return c.json({ message: "Measurement deleted" });
  } catch {
    return c.status(500);
  }
});

export const measurementRouter = app;

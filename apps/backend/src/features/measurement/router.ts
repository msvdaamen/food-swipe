import { sValidator } from "@hono/standard-validator";
import { matchError } from "better-result";
import { authRouterFactory } from "../auth/router";
import { createMeasurementDto } from "./dto/create-measurement.dto";
import { updateMeasurementDto } from "./dto/update-measurement.dto";
import { createMeasurementService } from "./service";

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const svc = createMeasurementService(c.get("db"));
  const result = await svc.all();
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.post("/", sValidator("json", createMeasurementDto), async (c) => {
  const svc = createMeasurementService(c.get("db"));
  const payload = c.req.valid("json");
  const result = await svc.create(payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.put("/:id", sValidator("json", updateMeasurementDto), async (c) => {
  const svc = createMeasurementService(c.get("db"));
  const id = Number(c.req.param("id"));
  const payload = c.req.valid("json");
  const result = await svc.update(id, payload);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json(result.value);
});

app.delete("/:id", async (c) => {
  const svc = createMeasurementService(c.get("db"));
  const id = Number(c.req.param("id"));
  const result = await svc.delete(id);
  if (result.isErr()) {
    return matchError(result.error, {
      UnhandledException: () => c.status(500),
    });
  }
  return c.json({ message: "Measurement deleted" });
});

export const measurementRouter = app;

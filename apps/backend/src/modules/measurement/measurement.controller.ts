import { Hono } from "hono";
import { measurementService } from "./measurement.service.ts";
import { createMeasurementDto } from "./dto/create-measurement.dto.ts";
import { updateMeasurementDto } from "./dto/update-measurement.dto.ts";
import { authRouterFactory } from "../auth/auth.controller.ts";
import { sValidator } from "@hono/standard-validator";

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const measurements = await measurementService.all();
  return c.json(measurements);
});

app.post("/", sValidator("json", createMeasurementDto), async (c) => {
  const payload = c.req.valid("json");
  const measurement = await measurementService.create(payload);
  return c.json(measurement);
});

app.put("/:id", sValidator("json", updateMeasurementDto), async (c) => {
  const payload = c.req.valid("json");
  const id = Number(c.req.param("id"));
  const measurement = await measurementService.update(id, payload);
  return c.json(measurement);
});

app.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await measurementService.delete(id);
  return c.json({ message: "Measurement deleted" });
});

export function registerMeasurementsController(instance: Hono) {
  instance.route("/v1/measurements", app);
}

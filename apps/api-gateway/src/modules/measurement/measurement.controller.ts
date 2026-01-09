import { Hono } from "hono";
import { createMeasurementDto } from "./dto/create-measurement.dto.ts";
import { updateMeasurementDto } from "./dto/update-measurement.dto.ts";
import { authRouterFactory } from "../auth/auth.controller.ts";
import { sValidator } from "@hono/standard-validator";
import { grpcTransport } from "../../lib/grpc-transport.ts";
import { Recipe } from "@food-swipe/grpc";
import { createClient } from "@connectrpc/connect";
import { getMeasurementsDto } from "./dto/get-ingredients.dto.ts";

const app = authRouterFactory.createApp();

const client = createClient(Recipe.RecipeService, grpcTransport);

app.get("/", sValidator("query", getMeasurementsDto), async (c) => {
  const payload = c.req.valid("query");
  const measurements = await client.listMeasurements(payload);
  return c.json(measurements);
});

app.post("/", sValidator("json", createMeasurementDto), async (c) => {
  const payload = c.req.valid("json");
  const response = await client.createMeasurement(payload);
  return c.json(response.measurement);
});

app.put("/:id", sValidator("json", updateMeasurementDto), async (c) => {
  const payload = c.req.valid("json");
  const id = Number(c.req.param("id"));
  const response = await client.updateMeasurement({
    id,
    ...payload,
  });
  return c.json(response.measurement);
});

app.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await client.deleteMeasurement({ id });
  return c.json({ message: "Measurement deleted" });
});

export function registerMeasurementsController(instance: Hono) {
  instance.route("/v1/measurements", app);
}

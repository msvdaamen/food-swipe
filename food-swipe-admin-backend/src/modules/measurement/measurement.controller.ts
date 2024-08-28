import {Hono} from "hono";
import {measurementService} from "./measurement.service.ts";
import {createMeasurementDto} from "./dto/create-measurement.dto.ts";
import {authRouter} from "../auth/auth.controller.ts";


const app = authRouter.createApp();

app.get('/', async (c) => {
    const measurements = await measurementService.all();
    measurements.forEach((measurement) => {
        console.log(typeof measurement.id)
    });
    return c.json(measurements);
});

app.post('/', async (c) => {
    const payload = createMeasurementDto.parse(await c.req.json());
    const measurement = await measurementService.create(payload);
    return c.json(measurement);
});

app.put('/:id', async (c) => {
    const payload = createMeasurementDto.parse(await c.req.json());
    const id = Number(c.req.param('id'));
    const measurement = await measurementService.update(id, payload);
    return c.json(measurement);
});

app.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    await measurementService.delete(id);
    return c.json({message: 'Measurement deleted'});
});

export function registerMeasurementsController(instance: Hono) {
    instance.route('/v1/measurements', app);
}
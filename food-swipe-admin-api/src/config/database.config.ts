import {z} from "zod";

const schema = z.object({
    DATABASE_URL: z.string(),
    UPLOADTHING_SECRET: z.string(),
});

const parsedConfig = schema.parse(process.env);

export const databaseConfig = {
    url: parsedConfig.DATABASE_URL,
    uploadThingSecret: parsedConfig.UPLOADTHING_SECRET,
}
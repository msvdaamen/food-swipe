import { type } from "arktype";

const schema = type({
    DATABASE_URL: 'string'
});

const parsedConfig = schema.assert(process.env);

export const databaseConfig = {
    url: parsedConfig.DATABASE_URL,
}

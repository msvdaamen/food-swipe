import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";
import {sql} from "drizzle-orm";

const queryClient = postgres(process.env.DATABASE_URL);


export const databaseProvider = drizzle(queryClient);
import {APIGatewayEvent, Context} from "aws-lambda";

import {Handler} from "aws-cdk-lib/aws-lambda";

export const handler: Handler = async (event: APIGatewayEvent, context: Context): Promise<any> => {
    const recipes = await databaseProvider.execute(sql`select * from recipes`);
    return {
        statusCode: 200,
        body: JSON.stringify({
            recipes,
            message: `Hello from test1!`
        }, null, 2),
    };
}
// sam local invoke -t ./cdk.out/LamdaTestStack.template.json test-1
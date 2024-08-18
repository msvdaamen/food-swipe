import {APIGatewayEvent, APIGatewayEventLambdaAuthorizerContext, Context, Handler} from "aws-lambda";
import {databaseProvider} from "../../../../providers/database.provider";
import {sql} from "drizzle-orm";
import {userService} from "../../../user/user.service";


export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
    const recipes = await databaseProvider.execute(sql`SELECT * FROM recipes`);
    const user = await userService.findById(Number(event.requestContext.authorizer?.principalId));
    return {
        statusCode: 200,
        body: JSON.stringify(recipes)
    }
}
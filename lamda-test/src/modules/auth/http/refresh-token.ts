import {APIGatewayEvent, Handler} from "aws-lambda";
import {signInDtoSchema} from "../dto/sign-in.dto";
import {authService} from "../auth.service";
import {refreshTokenDtoSchema} from "../dto/refresh-token.dto";

export const handler: Handler = async (event: APIGatewayEvent) => {
    const body = JSON.parse(event.body!);
    const result = refreshTokenDtoSchema.safeParse(body);
    if(!result.success) {
        return {
            statusCode: 400
        }
    }
    const {refreshToken} = result.data;
    const response = await authService.refreshTokens(refreshToken);
    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
};
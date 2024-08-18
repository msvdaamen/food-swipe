import {APIGatewayEvent, Handler} from "aws-lambda";
import {signInDtoSchema} from "../dto/sign-in.dto";
import {authService} from "../auth.service";
import {InvalidPassword} from "../errors/invalid-password";

export const handler: Handler = async (event: APIGatewayEvent) => {
    const body = JSON.parse(event.body!);
    const result = signInDtoSchema.safeParse(body);
    if(!result.success) {
        return {
            statusCode: 400
        }
    }
    const payload = result.data;
    try {
        const response = await authService.signIn(payload);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    } catch (e) {
        if (e instanceof InvalidPassword) {
            return {
                statusCode: 403,
                body: JSON.stringify({message: e.message})
            }
        }
        throw e;
    }
};
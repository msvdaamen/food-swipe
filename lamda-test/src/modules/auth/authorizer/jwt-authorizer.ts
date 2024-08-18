import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler} from "aws-lambda";
import {jwtProvider} from "../../../providers/jwt.provider";
import {JwtPayload, TokenExpiredError} from "jsonwebtoken";
import {userService} from "../../user/user.service";
import {User} from "../../user/schema/user.schema";


export const handler: APIGatewayTokenAuthorizerHandler = async (event): Promise<APIGatewayAuthorizerResult> => {
    const token = event.authorizationToken;
    const methodArn = event.methodArn;

    if (!token) {
        throw Error('Unauthorized');
    }

    try {
        const {sub, scopes} = await jwtProvider.verify(token) as JwtPayload & {scopes: ('user' | 'admin')[] | undefined};
        if (!sub || !scopes?.includes('admin')) {
            throw Error('Unauthorized');
        }
        const user = await userService.findById(Number(sub));
        if (!user) {
            throw Error('Unauthorized');
        }
        return sendResponse(user, methodArn)
    } catch (error) {
        return sendResponse(null, methodArn)
    }
};

function sendResponse(user: User | null, methodArn: string): APIGatewayAuthorizerResult {
    return {
        principalId: user ? user.id.toString() : 'anonymous',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: user ? 'Allow' : 'Deny',
                    Resource: methodArn
                }
            ]
        },
        context: {
            errorMessage: user ? 'Success' : 'Unauthorized'
        }
    }
}
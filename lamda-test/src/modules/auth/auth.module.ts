import {createlambda} from "../../../tools/aws/create-lamda";
import {RestApi, TokenAuthorizer} from "aws-cdk-lib/aws-apigateway";
import {Construct} from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import {Duration} from "aws-cdk-lib";
import {addRoute} from "../../../tools/aws/food-swipe-admin-backend-stack";
import * as path from "node:path";


export function authInfrastructure(scope: Construct, api: RestApi) {
    const jwtSecret = ssm.StringParameter.valueFromLookup(scope, 'JWT_SECRET');

    const jwtAuthorizerFn = createlambda(scope, 'jwt-authorizer-lambda', path.join(__dirname, '/authorizer/jwt-authorizer.ts'), {extraEnvironment: {JWT_SECRET: jwtSecret}});

    const authorizer = new TokenAuthorizer(scope, 'jwt-authorizer', {
        handler: jwtAuthorizerFn
    });

    const authSignInFn = createlambda(scope, 'auth-sign-in-lambda', path.join(__dirname, '/http/sign-in.ts'), {extraEnvironment: {JWT_SECRET: jwtSecret}, extraTimeout: Duration.seconds(10)});
    const refreshTokenFn = createlambda(scope, 'refresh-token-lambda', path.join(__dirname, '/http/refresh-token.ts'), {extraEnvironment: {JWT_SECRET: jwtSecret}});

    addRoute(api, 'POST', '/auth/sign-in', authSignInFn);
    addRoute(api, 'POST', '/auth/refresh-token', refreshTokenFn);

    return {
        authorizer
    };
}
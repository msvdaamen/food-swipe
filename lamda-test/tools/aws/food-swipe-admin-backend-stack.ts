import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {createApiGateway} from "./createApiGateway";
import {CfnOutput} from "aws-cdk-lib";
import {RestApi, TokenAuthorizer, MethodOptions} from "aws-cdk-lib/aws-apigateway";
import {Function as LambdaFunction} from "aws-cdk-lib/aws-lambda";
import {authInfrastructure} from "../../src/modules/auth/auth.module";
import {recipeInfrastructure} from "../../src/modules/recipe/recipe.module";

export class FoodSwipeAdminBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGateway = createApiGateway(this);

    const {authorizer} = authInfrastructure(this, apiGateway);
    recipeInfrastructure(this, apiGateway, authorizer);

    new CfnOutput(this, 'api-gateway-url', {
        value: apiGateway.url
    })
  }
}
export function addRoute(api: RestApi, method: HttpMethods, path: string, lambda: LambdaFunction, authorizer?: TokenAuthorizer) {
    let options: MethodOptions = {
        authorizer: authorizer ?? undefined,
        authorizationType: authorizer ? apigateway.AuthorizationType.CUSTOM : undefined
    };
    api.root.resourceForPath(path).addMethod(method, new apigateway.LambdaIntegration(lambda), options)
}
type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'ANY';
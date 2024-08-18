import {addRoute} from "../../../tools/aws/food-swipe-admin-backend-stack";
import {createlambda} from "../../../tools/aws/create-lamda";
import * as path from "node:path";
import {RestApi, TokenAuthorizer} from "aws-cdk-lib/aws-apigateway";
import {Construct} from "constructs";

export function recipeInfrastructure(scope: Construct, api: RestApi, authorizer: TokenAuthorizer) {
    const getRecipesFn = createlambda(scope, 'get-recipes', path.join(__dirname, '/lambda/get-recipes/index-lambda.ts'));
    addRoute(api, 'GET', '/recipes', getRecipesFn, authorizer);
}
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {Construct} from "constructs";

export function createApiGateway(scope: Construct) {
    const apiGateway = new apigateway.RestApi(scope, 'food-swipe-admin', {
        restApiName: 'food-swipe-admin',
        description: 'This is the admin api for food swipe',
        endpointTypes: [apigateway.EndpointType.REGIONAL],
        defaultCorsPreflightOptions: {
            allowOrigins: ['http://localhost:4200', 'https://food-swipe-admin.msvdaamen.com'],
        }
    });
    return apiGateway;
}
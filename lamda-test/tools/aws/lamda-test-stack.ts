import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {createApiGateway} from "./createApiGateway";

export class LamdaTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGateway = createApiGateway(this);

    for (let i = 1; i < 3; i++) {
      const myFn  = new lambda.Function(this, `test-${i}`, {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: `index.handler`,
        code: lambda.Code.fromAsset(`dist/lambda/test${i}`),
        environment: {
          DATABASE_URL: 'postgresql://postgres.ttuopygcpuzjiepfgixf:Gymshark3006!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
          NODE_OPTIONS: '--enable-source-maps'
        },
        tracing: lambda.Tracing.DISABLED,
      });
      apiGateway.root.addResource(`test${i}`).addMethod('GET', new apigateway.LambdaIntegration(myFn));
    }
  }
}

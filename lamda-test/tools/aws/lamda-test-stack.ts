import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

export class LamdaTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'LamdaTestQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    for (let i = 1; i < 3; i++) {
      const myFn  = new lambda.Function(this, `test-${i}`, {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: `index.handler`,
        code: lambda.Code.fromAsset(`dist/test${i}`),
      });

      myFn.addToRolePolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['*'],
        actions: ['lambda:InvokeFunction']
      }));

      // Define the Lambda function URL resource
      const myFunctionUrl = myFn.addFunctionUrl({
        authType: lambda.FunctionUrlAuthType.NONE,
      });

      // Define a CloudFormation output for your URL
      new cdk.CfnOutput(this, `function-url-output-${i}`, {
        value: myFunctionUrl.url,
      })
    }
  }
}

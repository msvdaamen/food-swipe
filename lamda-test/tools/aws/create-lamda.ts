import * as lambda from "aws-cdk-lib/aws-lambda";
import {Tracing} from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {Duration} from "aws-cdk-lib";
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';

type Props = {
    extraEnvironment?: Record<string, string>;
    extraTimeout?: Duration;
}

export const createlambda =  (scope: Construct, name: string, path: string, props?: Props) => {
    const databaseUrl = ssm.StringParameter.valueFromLookup(scope, 'PROD_DATABASE_URL');
    const nodeFn = new NodejsFunction(scope, name, {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path,
        environment: {
            DATABASE_URL: databaseUrl,
            NODE_OPTIONS: '--enable-source-maps',
            ...((props?.extraEnvironment) ? props?.extraEnvironment : {}),
        },
        tracing: Tracing.DISABLED,
        timeout: props?.extraTimeout ?? Duration.seconds(3),
        bundling: {
            externalModules: [
                '@aws-sdk/*'
            ],
            minify: true,
            sourceMap: true
        }
    })
    return nodeFn;
}
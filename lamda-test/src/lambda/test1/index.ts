import {lorem} from "../../lorem";
import {InvokeAsyncCommand, InvokeAsyncCommandInput, InvokeCommand, LambdaClient} from "@aws-sdk/client-lambda";

const client = new LambdaClient({
    region: 'eu-central-1' // Specify the
});

export const handler = async (event: any = {}): Promise<any> => {
    const command = new InvokeCommand({
        FunctionName: 'test-2'
    })
    const result =  await client.send(command);
    console.log(result)
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello from test1!`,
            input: event,
        }, null, 2),
    };
}
// sam local invoke -t ./cdk.out/LamdaTestStack.template.json test-1
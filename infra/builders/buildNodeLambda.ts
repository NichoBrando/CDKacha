import { Duration, Stack } from 'aws-cdk-lib';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';
import * as Lambda from 'aws-cdk-lib/aws-lambda';

interface ILambdaProps {
    name: string;
    handler: string;
    environment: {};
}

const buildNodeLambda = (context: Stack, props: ILambdaProps) => {
    return new Lambda.Function(context, props.name, {
        ...props,
        runtime: Lambda.Runtime.NODEJS_14_X,
        code: Lambda.Code.fromAsset('resources'),
        timeout: Duration.seconds(300),
    });
};

export default buildNodeLambda;

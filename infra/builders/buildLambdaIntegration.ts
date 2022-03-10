import * as ApiGateway from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

const buildLambdaIntegration = (lambda: IFunction) => {
    return new ApiGateway.LambdaIntegration(lambda, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });
};

export default buildLambdaIntegration;

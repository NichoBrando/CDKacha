import { Stack } from 'aws-cdk-lib';
import * as ApiGateway from 'aws-cdk-lib/aws-apigateway';

const buildRestApi = (context: Stack, name: string) => {
    return new ApiGateway.RestApi(context, name, {
        restApiName: 'Cdkacha API',
        description: 'Service for pull chracter and list your obtained characters',
    });
};

export default buildRestApi;

import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as ApiGateway from 'aws-cdk-lib/aws-apigateway';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';

export class InfraStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const characterTable = new DynamoDB.Table(this, 'Characters', {
            partitionKey: { name: 'id', type: DynamoDB.AttributeType.STRING },
            billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
        });

        const pullCharacterHandler = new Lambda.Function(this, 'pullCharacterHandler', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            code: Lambda.Code.fromAsset('resources'),
            handler: 'pullCharacter.main',
            timeout: Duration.seconds(300),
            environment: {
                charactersTable: characterTable.tableName,
            },
        });

        const listCharactersHandler = new Lambda.Function(this, 'listCharacterHandler', {
            runtime: Lambda.Runtime.NODEJS_14_X,
            code: Lambda.Code.fromAsset('resources'),
            handler: 'listCharacters.main',
            timeout: Duration.seconds(300),
            environment: {
                charactersTable: characterTable.tableName,
            },
        });

        characterTable.grantWriteData(pullCharacterHandler);
        characterTable.grantReadData(listCharactersHandler);

        const api = new ApiGateway.RestApi(this, 'cdkacha-api', {
            restApiName: 'Cdkacha API',
            description: 'Service for pull chracter and list your obtained characters',
        });

        const pullCharacterIntegration = new ApiGateway.LambdaIntegration(pullCharacterHandler, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        const listCharacterIntegration = new ApiGateway.LambdaIntegration(listCharactersHandler, {
            requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
        });

        api.root.addMethod('POST', pullCharacterIntegration);
        api.root.addMethod('GET', listCharacterIntegration);
    }
}

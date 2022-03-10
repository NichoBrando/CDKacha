import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import buildDynamoTable from '../builders/buildDynamoTable';
import buildNodeLambda from '../builders/buildNodeLambda';
import buildRestApi from '../builders/buildRestApi';
import buildLambdaIntegration from '../builders/buildLambdaIntegration';
import buildDeployPipeline from '../builders/buildDeployPipeline';
import buildGameBucket from '../builders/buildGameBucket';

export class InfraStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const appBucket = buildGameBucket(this);

        const characterTable = buildDynamoTable(this, 'Characters');

        const generalEnvironment = {
            charactersTable: characterTable.tableName,
        };

        const pullCharacterHandler = buildNodeLambda(this, {
            name: 'pullCharacterHandler',
            handler: 'pullCharacter.main',
            environment: generalEnvironment,
        });

        const listCharactersHandler = buildNodeLambda(this, {
            name: 'listCharacterHandler',
            handler: 'listCharacters.main',
            environment: generalEnvironment,
        });

        characterTable.grantWriteData(pullCharacterHandler);
        characterTable.grantReadData(listCharactersHandler);

        const api = buildRestApi(this, 'cdkacha-api');

        const pullCharacterIntegration = buildLambdaIntegration(pullCharacterHandler);
        const listCharacterIntegration = buildLambdaIntegration(listCharactersHandler);

        api.root.addResource('pull-character').addMethod('POST', pullCharacterIntegration);
        api.root.addResource('list-characters').addMethod('GET', listCharacterIntegration);

        buildDeployPipeline(this, {
            targetBucket: appBucket,
            restApi: api,
        });
    }
}

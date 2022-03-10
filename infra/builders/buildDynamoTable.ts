import { Stack } from 'aws-cdk-lib';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';

const buildDynamoTable = (context: Stack, tableName: string) => {
    return new DynamoDB.Table(context, tableName, {
        partitionKey: { name: 'id', type: DynamoDB.AttributeType.STRING },
        billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
    });
};

export default buildDynamoTable;

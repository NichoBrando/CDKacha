const { DynamoDB } = require('aws-sdk');
const { env } = require('process');

const dynamoClient = new DynamoDB.DocumentClient();

exports.main = async function (event) {
    try {
        if (event.httpMethod !== 'GET') {
            return {
                statusCode: 405,
                headers: {},
                body: 'This method only accept GET.',
            };
        }

        const scanResult = await dynamoClient
            .scan({
                TableName: env.charactersTable,
            })
            .promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            },
            body: JSON.stringify(scanResult.Items),
        };
    } catch (error) {
        const body = error.stack || JSON.stringify(error || {});
        return {
            statusCode: 400,
            headers: {},
            body: JSON.stringify(body),
        };
    }
};

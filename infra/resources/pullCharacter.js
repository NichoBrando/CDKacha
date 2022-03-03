const { DynamoDB } = require('aws-sdk');
const { env } = require('process');
const { v4 } = require('uuid');

const dynamoClient = new DynamoDB.DocumentClient();

const characterList = [
    'Rohan, o renegado',
    'Regulus, o prodígio',
    'Arqueiro de Pagos',
    'Escudeiro de Pagos',
    'Sacerdotisa de Pagos',
    'Dracoguerreiro de Pagos',
    'Dracoguerreiro de Ignis',
    'Cavaleiro de Pagos',
    'Aventureiro de Pagos',
    'Mago de Pagos',
];

exports.main = async function (event) {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: {},
                body: 'This method only accept POST.',
            };
        }

        const randomNumber = Math.floor(Math.random() * characterList.length + 1);
        const charName = characterList[randomNumber];

        const Item = {
            id: v4(),
            name: charName,
        };

        await dynamoClient
            .put({
                TableName: env.charactersTable,
                Item,
            })
            .promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify(Item),
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

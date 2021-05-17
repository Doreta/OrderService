'use strict';

const AWS = require("aws-sdk");

const dev = {
    region: 'localhost',
    endpoint: "http://dynamo:8000",
    accessKeyId: 'MOCK_ACCESS_KEY_ID',
    secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
    convertEmptyValues: true
};

const prod = { region: process.env.REGION || 'us-east-1' };

const config = process.env.IS_OFFLINE ? dev : prod

AWS.config.update(config);
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const tableDynamo = process.env.DYNAMO_TABLE || '';

const client = {

    /**
     * Save an Item on DynamoDBs
     */
    save: async (item, table = tableDynamo) => {

        const params = {
            TableName: table,
            Item: item
        };

        return await dynamoClient.put(params).promise();
    },

    /**
     * Find by Key comparison
     */
    find: async where => {

        const params = {
            TableName: tableDynamo,
            Key: where
        };

        return await dynamoClient.get(params).promise();
    },

    /**
     * Execute a Raw Select Query on DynamoTable. 
     * You must inform the KeyConditionExpression 
     * and ExpressionAttributeNames
     */
    query: async where => {
        where.TableName = tableDynamo;
        return await dynamoClient.query(where).promise();
    },

    /**
     * Execute a DynamoDB Scan 
     * Eventually Consistent
     */
    scan: async (params, limit, table = tableDynamo) => {
        params.TableName = table;
        return await dynamoClient.scan(params).promise();
    },

    /**
     * Update Expression based on Key comparison
     */
    update: async (key, expression, values, table = tableDynamo) => {

        const params = {
            TableName: table,
            Key: key,
            UpdateExpression: expression,
            ExpressionAttributeValues: values,
            ReturnValues: "UPDATED_NEW"
        };

        return await dynamoClient.update(params).promise();
    },

    /**
     * Update item identified by Key
     */
    updateItem: async (key, attributes, table = tableDynamo) => {
        
        const params = {
            TableName: table,
            Key: key,
            ReturnValues: "ALL_NEW",
            AttributeUpdates: attributes
        };

        return await dynamoClient.update(params).promise();
    },

    /**
     * Remove a row from DynamoDB based on Key comparison
     */
    removeRow: async (key, table = tableDynamo) => {

        const params = {
            TableName: table,
            Key: key,
            ReturnValues: "ALL_OLD"
        };

        return await dynamoClient.delete(params).promise();
    }

}

module.exports = client;

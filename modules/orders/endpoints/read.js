'use strict';

const dynamo = require('../../../shared/lib/dynamo');
const sqs    = require('../../../shared/lib/sqs')
const response = require('../../../shared/lib/response');

const DYNAMO_TABLE_ORDERS = process.env.DYNAMO_TABLE_ORDERS || 'orders';
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL || 'order';

async function list(event) {
    try {
        const res = await dynamo.scan({}, DYNAMO_TABLE_ORDERS);
        return response.json(res.Items);
    } catch (error) {
        return response.json(error, 500);
    }
};

async function detail(event) {
    try {
        const orderId = event.pathParameters.orderId;
    
        const res = await dynamo.find(orderId);
    
        if (res.Item) {
            return response.json(res.Item);
        } else {
            return response.json("Not Found", 404);
        }
    } catch (error) {
        return response.json(error, 500);
    }
};

export default {
    list: list,
    detail: detail
}

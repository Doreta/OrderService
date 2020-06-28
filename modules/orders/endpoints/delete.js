'use strict';

const dynamo = require('../../../shared/lib/dynamo');
const response = require('../../../shared/lib/response');

const DYNAMO_TABLE_ORDERS = process.env.DYNAMO_TABLE_ORDERS || 'orders';

async function deleteOrder(event) {
    try {
        const key = { orderId: event.pathParameters.orderId };
        const res = await dynamo.removeRow(key, DYNAMO_TABLE_ORDERS);
        return response.json(res, 204);
    } catch (error) {
        return response.json(error, 500);
    }
}

export default deleteOrder;

'use strict';

const uuid = require('../../../shared/lib/uuid');
const dynamo = require('../../../shared/lib/dynamo');
const response = require('../../../shared/lib/response');
const sqs = require('../../../shared/lib/sqs');

const DYNAMO_TABLE_ORDERS = process.env.DYNAMO_TABLE_ORDERS || 'orders';

async function create (event) {
    const body = event.body ? event.body : event;
    const data = JSON.parse(body);

    const orderId = uuid();

    const order = {
        orderId: orderId,
        products: data.products,
        userId: data.userId,
        userEmail: data.userEmail,
        address: data.address,
        created: new Date().getTime()
    };
    /**
     * Save item on DynamoDB and put orderID on SQS Queue to be
     */
    await Promise.all([
            dynamo.save(order, DYNAMO_TABLE_ORDERS),
            sqs.sendToQueue({ orderId: orderId })
        ])
        .then(success => {
            response.json(success, 201);
        })
        .catch(err => {
            response.json(err, 500);
        });
}

export default create;

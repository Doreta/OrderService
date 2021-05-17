'use strict';

const dynamo = require('../../../../shared/lib/dynamo');
const sqs = require('../../../../shared/lib/sqs');

const DYNAMO_TABLE_ORDERS = process.env.DYNAMO_TABLE_ORDERS || 'orders';
const DYNAMO_TABLE_MESSAGES = process.env.DYNAMO_TABLE_MESSAGES || 'messages';
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL || 'order';

let lastIntervalID;

/**
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.messageService = (event, context, callback) => {

    if (lastIntervalID) {
        clearInterval(lastIntervalID);
    }
    
    //Get records on SQS to update a DynamoDB Table
    lastIntervalID = setInterval(() => {

        sqs.consumeQueue(1, SQS_QUEUE_URL)
            .then(poll => {
                if (!poll.Messages) {
                    return;
                } else {
                    poll.Messages.forEach(message => {

                        const item = JSON.parse(message.Body);

                        //Update item on DynamoDB and remove from Queue
                        _updateRecord(item.orderId)
                            .then(success => sqs.removeFromQueue(message))
                            .catch(err => console.log(err));

                    });
                }

        }).catch(err => console.log(err));

    }, 100);

};

/**
 * @param {*} orderId 
 */
const _updateRecord = async orderId => {
    const { Item } = await dynamo.find(orderId);

    if (Item) {
        await _sendEmail(Item);
        const params = {
            Item: {
                orderId: orderId,
                emailSent: true
            }
        }

        return await dynamo.save(params, DYNAMO_TABLE_MESSAGES);
    }

    return 'Order Not Found';
}

const _sendEmail = async item => {
    const {orderId, userEmail } = item;
    //to do - send an email to the user email by using SES service
    return true;
}

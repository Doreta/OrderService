'use strict';

const AWS = require("aws-sdk");
const endpoint = process.env.SQS_QUEUE_URL;

const local = "http://sqs:9324";

const dev = {
    apiVersion: '2012-11-05',
    region: process.env.REGION || 'localhost',
    endpoint: local,
    sslEnabled: false,
    accessKeyId: 'MOCK_ACCESS_KEY_ID',
    secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
};

const prod = {
    apiVersion: '2012-11-05',
    region: process.env.REGION || 'us-east-1'
}

const options  = process.env.IS_OFFLINE ? dev : prod

const _sqs = new AWS.SQS(options);


const client = {

    /**
     * Save new message into queue
     */
    save: (message, queue=endpoint) => {

        const url = process.env.IS_OFFLINE ? `${local}/queue/${queue}` : queue;

        const params = {
            QueueUrl: url,
            MessageBody: JSON.stringify(message)
        };

        return _sqs.sendMessage(params).promise();
    },
    /**
     * Send message to queue
     */
    sendToQueue: (message, queue=endpoint) => {

        const url = process.env.IS_OFFLINE  ? `${local}/queue/${queue}` : queue;

        const params = {
            QueueUrl: url,
            MessageBody: JSON.stringify(message)
        };

        return _sqs.sendMessage(params).promise();
    },
    /**
     * Get messages from Queue
     */
    consumeQueue: (numberOfMessages = 1, queue=endpoint) => {

        const url = process.env.IS_OFFLINE ? `${local}/queue/${queue}` : queue;
        const params = {
            QueueUrl: url,
            MaxNumberOfMessages: numberOfMessages
        };

        console.log(params);

        return _sqs.receiveMessage(params).promise();
    },
    /**
     * Remove message from quue
     */
    removeFromQueue: (message, queue=endpoint) => {

        if (message !== false && message !== undefined) {

            const url = process.env.IS_OFFLINE ? `${local}/queue/${queue}` : queue;

            const params = {
                QueueUrl: url,
                ReceiptHandle: message.ReceiptHandle
            };
    
            return _sqs.deleteMessage(params).promise();
    
        }

    }
}

module.exports = client;

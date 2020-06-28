'use strict';

const dynamo = require('../../../shared/lib/dynamo');
const response = require('../../../shared/lib/response');

const DYNAMO_TABLE_ORDERS = process.env.DYNAMO_TABLE_ORDERS || 'orders';

async function update(event) {
  try {
    const body = event.body ? event.body : event;
    const data = JSON.parse(body);
    
    const key = {
      orderId: event.pathParameters.orderId
    };
    
    const params = {};
    
    if (data.userId) {
      params.userId = {
        Action: 'PUT',
        Value: data.userId
      };
    }
    
    if (data.userEmail) {
      params.userEmail = {
        Action: 'PUT',
        Value: data.userEmail
      };
    }
    
    if (data.products) {
      params.products = {
        Action: 'PUT',
        Value: data.products
      };
    }
    
    if (data.address) {
      params.address = {
        Action: 'PUT',
        Value: data.address
      };
    }
    
    const res = await dynamo.updateItem(key, params, DYNAMO_TABLE_ORDERS);
    return response.json(res.Attributes);
  } catch (error) {
    return response.json(error, 500);
  }
};

export default update;

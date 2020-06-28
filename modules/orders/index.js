import create from './endpoints/create';
import deleteOrder from './endpoints/delete';
import update from './endpoints/update';
import read from './endpoints/read';
import response from '../../shared/lib/response';


export const handler = async event => {
    try {
      const { httpMethod } = event;
  
      switch (httpMethod) {
        case "GET": {
          if (event.pathParameters && event.pathParameters.orderId) {
            return await read.detail(event);
          } else {
            return await read.list(event);
          }
        }
        case "POST":
          return await create(event)
        case "PUT":
          await await update(event);
        case "DELETE":
          await await deleteOrder(event);
        default:
          throw new Error("Bad HTTP Method");
      }
    } catch (error) {
      return response.json(error, 500);
    }
  };
  
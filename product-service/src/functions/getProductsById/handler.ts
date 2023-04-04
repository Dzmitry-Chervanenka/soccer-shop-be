import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from "@functions/mock-db";


const getProductsList: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
    const id = event.pathParameters.productId;
    const product = products.find(p=> p.id === id);
    if(!product){
        return formatJSONResponse(null, {status: 404, message: 'Not Found'})
    }
    return formatJSONResponse({product});
};

export const main = middyfy(getProductsList);

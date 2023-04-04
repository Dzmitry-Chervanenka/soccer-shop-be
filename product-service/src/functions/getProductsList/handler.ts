import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from "@functions/getProductsList/mock-db";


const hello: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    return formatJSONResponse({
        products
    });
};

export const main = middyfy(hello);

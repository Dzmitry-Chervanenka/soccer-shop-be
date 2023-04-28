import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {
    DynamoDBClient, GetItemCommand, GetItemCommandOutput
} from "@aws-sdk/client-dynamodb";
import {fromProductDao} from "@functions/getProductsList/fromProductDao";



const getProductById: ValidatedEventAPIGatewayProxyEvent<null> = async ({pathParameters: {productId}}) => {
    const params = {
        TableName: process.env.PRODUCTS_TABLE_NAME || "",
        Key: {
            id: {
                S: productId
            }
        },
    };
    const client = new DynamoDBClient({});

    const product:GetItemCommandOutput = await client.send(new GetItemCommand(params));

    if(!product.Item){
        return formatJSONResponse(null, {status: 404, message: 'Not Found'})
    }
    return formatJSONResponse({product: fromProductDao(product.Item)});
};

export const main = middyfy(getProductById);

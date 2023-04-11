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

    console.log(client)
    const products:GetItemCommandOutput = await client.send(new GetItemCommand(params));

    console.log(products)
    if(!products.Item){
        return formatJSONResponse(null, {status: 404, message: 'Not Found'})
    }
    return formatJSONResponse({product: fromProductDao(products.Item)});
};

export const main = middyfy(getProductById);

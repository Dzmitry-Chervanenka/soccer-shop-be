import { middyfy } from '@libs/lambda';

import { v4 as uuid } from 'uuid';
import {formatJSONResponse} from "@libs/api-gateway";
import {DynamoDBClient, PutItemCommand, PutItemCommandOutput} from "@aws-sdk/client-dynamodb";
import toProductDao from "@functions/createProduct/toProductDao";

const createProduct = async (event) => {
        const data = JSON.parse(event.body || "{}");
        const params = {
            TableName: process.env.PRODUCTS_TABLE_NAME || "",
            Item: toProductDao({
                id: uuid(),
                title: data.title || "",
                price: data.price || "0",
                description: data.description || ""
            })
        };
    const client = new DynamoDBClient({});
    const resp: PutItemCommandOutput = await client.send(new PutItemCommand(params))
    return formatJSONResponse({product: resp})
};

export const main = middyfy(createProduct);

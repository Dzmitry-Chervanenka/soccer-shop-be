import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {
    DynamoDBClient,
    ScanCommand,
    ScanCommandInput, ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import {fromProductDao} from "@functions/getProductsList/fromProductDao";


const getProductsList: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    const scanProductsParams: ScanCommandInput = {
         TableName: process.env.PRODUCTS_TABLE_NAME,
    }
    const scanStocksParams: ScanCommandInput = {
        TableName: process.env.STOCKS_TABLE_NAME,
    }
    const client = new DynamoDBClient({});

    const products: ScanCommandOutput = await client.send(new ScanCommand( scanProductsParams))
    const stocks: ScanCommandOutput = await client.send(new ScanCommand(scanStocksParams))
    const productsStocksItems = products.Items.map((product) => ({
        ...fromProductDao(product),
        count: +stocks.Items.find(stock => stock.product_id.S === product.id.S )?.count?.N || 0
    }))
    return formatJSONResponse([...productsStocksItems]);
};

export const main = middyfy(getProductsList);

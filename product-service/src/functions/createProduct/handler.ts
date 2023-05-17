import { middyfy } from '@libs/lambda';

import {formatJSONResponse} from "@libs/api-gateway";
import {PutItemCommandOutput} from "@aws-sdk/client-dynamodb";
import ProductService from "@functions/services/productService";

const createProduct = async (event) => {
    const data = JSON.parse(event.body || "{}");
    const resp: PutItemCommandOutput = await ProductService.getInstance().createProduct(data)
    return formatJSONResponse({product: resp})
};

export const main = middyfy(createProduct);

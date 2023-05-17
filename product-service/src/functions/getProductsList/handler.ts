import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from "@functions/services/productService";


const getProductsList: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
    const productsWithStocks = await ProductService.getInstance().getProductsWithStocksMock();
    return formatJSONResponse([...productsWithStocks]);
};

export const main = middyfy(getProductsList);

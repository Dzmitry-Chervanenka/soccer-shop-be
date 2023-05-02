import middy from "@middy/core";
import {SQSEvent} from "aws-lambda";
import ProductService from "@functions/services/productService";

const catalogBatchProcess = async (event: SQSEvent) => {
    try {
        console.log(event.Records)
        await Promise.all(
            event.Records.map((record) => {
                console.log("record")
                console.log(record)
                return ProductService.getInstance().createProduct(JSON.parse(record.body))
            })
        )
    } catch (e) {
        console.log('error')
        console.log(e)
    }


};

export const main = middy(catalogBatchProcess);


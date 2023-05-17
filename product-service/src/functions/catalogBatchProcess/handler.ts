import middy from "@middy/core";
import {SQSEvent} from "aws-lambda";
import ProductService from "@functions/services/productService";
import {PublishCommand, SNSClient} from "@aws-sdk/client-sns";
import getCredentials from "../../../../getCredentials";

const catalogBatchProcess = async (event: SQSEvent) => {
    try {
        const created = [];
        await Promise.all(
            event.Records.map((record) => {
                console.log(record)
                created.push(record)
                return ProductService.getInstance().createProduct(JSON.parse(record.body))
            })
        )

        const sns = new SNSClient({
            region: "eu-north-1",
            credentials: getCredentials(),
        })

        const resp = await sns.send(new PublishCommand({
            Message: "Products are created: " + JSON.stringify(created, null,4),
            TopicArn: "arn:aws:sns:eu-north-1:034402733310:createProductTopic",
        }))
        console.log(resp)
    } catch (e) {
        console.log('error')
        console.log(JSON.stringify(e))
    }


};

export const main = middy(catalogBatchProcess);


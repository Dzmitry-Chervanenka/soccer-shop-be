import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import getCredentials from "../../../getCredentials";
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {Readable} from "stream";

const csv = require('csv-parser');

const importFileParser = async (event) => {
    console.log(event)
    const client = new S3Client({region: 'eu-north-1', credentials: getCredentials()})

    const item = event.Records[0]
    const params = {
        Bucket: item.s3.bucket.name,
        Key: item.s3.object.key,
    }
    const sqs = new SQSClient({
        region: "eu-north-1",
        credentials: getCredentials()
    })
    const resp = await sqs.send(new SendMessageCommand({
        QueueUrl:"https://sqs.eu-north-1.amazonaws.com/034402733310/catalogItemsQueue",
        MessageBody: JSON.stringify({
            title: "testtest",
            description: 'description',
            price: '69'
        })
    }))
    console.log( 'resp')
    console.log(resp)
    try {
        const getObjectCommand = new GetObjectCommand(params);

        const getObjectResult = await client.send(getObjectCommand);

        const { Body } = getObjectResult;
        const asStream = (Body as Readable).pipe(csv());
        for await (const record of asStream) {
            const resp = await sqs.send(
                new SendMessageCommand({
                    QueueUrl: "https://sqs.eu-north-1.amazonaws.com/034402733310/catalogItemsQueue",
                    MessageBody: JSON.stringify(record),
                })
            );
            console.log('for await (const record of asStream) {')
            console.log(resp)
        }
        // @ts-ignore
        // getObjectResult.Body.pipe(
        //     csv()
        // )
        //     .on("data", async (data) => {
        //         console.log('on data', data)
        //         try {
        //             console.log("after try")
        //             const resp = await sqs.send(new SendMessageCommand({
        //                 QueueUrl:"https://sqs.eu-north-1.amazonaws.com/034402733310/catalogItemsQueue",
        //                 MessageBody: JSON.stringify(data),
        //             }))
        //             console.log(resp)
        //
        //             console.log('after sent')
        //         } catch (e) {
        //             console.log('error')
        //             console.log(e)
        //         }
        //
        //
        //     })
    } catch (err) {
        console.error(err);
    }

}

export const main = importFileParser

import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {Readable} from "stream";
import getCredentials from "../../../../getCredentials";

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
    try {
        const getObjectCommand = new GetObjectCommand(params);

        const getObjectResult = await client.send(getObjectCommand);

        const { Body } = getObjectResult;
        const asStream = (Body as Readable).pipe(csv());
        for await (const record of asStream) {
            console.log(record)
            const resp = await sqs.send(
                new SendMessageCommand({
                    QueueUrl: "https://sqs.eu-north-1.amazonaws.com/034402733310/catalogItemsQueue",
                    MessageBody: JSON.stringify(record),
                }))
            console.log(resp)
        }
    } catch (err) {
        console.error(err);
    }

}

export const main = importFileParser

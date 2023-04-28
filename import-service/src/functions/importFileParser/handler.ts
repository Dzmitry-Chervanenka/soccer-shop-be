import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import getCredentials from "../../../getCredentials";

const csv = require('csv-parser');

const importFileParser = async (event) => {
    const client = new S3Client({region: 'eu-north-1', credentials: getCredentials()})

    const item = event.Records[0]
    const params = {
        Bucket: item.s3.bucket.name,
        Key: item.s3.object.key,
    }
    console.log(params)
    const results = [];
    try {
        const getObjectCommand = new GetObjectCommand(params);

        const getObjectResult = await client.send(getObjectCommand);

        // Result.Body is a stream of object content
        // @ts-ignore
        getObjectResult.Body.pipe(
            csv()
        )
            .on("data", (data) => {
                console.log('on data', data)
                results.push(data)
            })
            .on("end", (data) => {
                console.log('on end')
                console.log(data)
            });
    } catch (err) {
        console.error(err);
    }

}

export const main = importFileParser

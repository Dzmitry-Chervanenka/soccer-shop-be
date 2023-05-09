import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { S3RequestPresigner} from "@aws-sdk/s3-request-presigner";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { Hash } from "@aws-sdk/hash-node";
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import {middyfy} from "@libs/lambda";
import getCredentials from "../../../../getCredentials";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<unknown>  = async (event) => {
  try{
    const fileName = event.queryStringParameters.name
    const url =  await createPresignedUrlWithoutClient({
      region: 'eu-north-1',
      bucket: 'soccer-shop-be-uploaded',
      key: 'uploaded/'+fileName,
    })
    return formatJSONResponse({
      message: `Hello, welcome to the exciting Serverless world!`,
      url
    });
  } catch (e) {
    return formatJSONResponse({
      message: `error`,
      e
    });
  }

};

export const main = middyfy(importProductsFile)


const createPresignedUrlWithoutClient = async ({ region, bucket, key }) => {
  const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
  const presigner = new S3RequestPresigner({
    credentials: getCredentials(),
    region,
    sha256: Hash.bind(null, "sha256"),

  });

  const signedUrlObject = await presigner.presign(
      new HttpRequest({ ...url, method: "PUT" })
  );
  return formatUrl(signedUrlObject);
};


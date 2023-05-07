import type { AWS } from '@serverless/typescript';

import importProductsFile from "@functions/importProductsFile";
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    region:"eu-north-1",
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: "arn:aws:s3:::soccer-shop-be-uploaded",
          },
          {
            Effect: "Allow",
            Action: ["sqs:*"],
            Resource:"arn:aws:sqs:eu-north-1:034402733310:catalogItemsQueue"
          },
          {
            "Effect": "Allow",
            "Action": [
                "sqs:SendMessage"
            ],
            "Resource": "arn:aws:lambda:eu-north-1:034402733310:function:import-service-dev-importFileParser"
          }

        ]
      }
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;

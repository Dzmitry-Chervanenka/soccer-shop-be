import type { AWS } from '@serverless/typescript';
import getProductsList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";


const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: "eu-north-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:Scan", "dynamodb:UpdateItem", "dynamodb:GetItem", "dynamodb:PutItem"],
            Resource: "arn:aws:dynamodb:eu-north-1:034402733310:table/products",
          },
          {
            Effect: "Allow",
            Action: ["dynamodb:Scan", "dynamodb:UpdateItem", "dynamodb:GetItem", "dynamodb:PutItem"],
            Resource: "arn:aws:dynamodb:eu-north-1:034402733310:table/stocks",
          }
        ]
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: 'products',
      STOCKS_TABLE_NAME: 'stocks'
    },
  },
  functions: { getProductsList, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;

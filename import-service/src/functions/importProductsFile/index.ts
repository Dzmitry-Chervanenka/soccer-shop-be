import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        cors: {
          origin: '*'
        },
        authorizer: "arn:aws:lambda:eu-north-1:034402733310:function:authorization-service-dev-basicAuthorizer"
      },
    },
  ],
};

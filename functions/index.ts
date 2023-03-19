import { createLambdaFunction, createProbot } from '@probot/adapter-aws-lambda-serverless';

import app from '../src/bot';


export const handler = createLambdaFunction(app, {
    probot: createProbot(),
});
  
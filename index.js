import { createLambdaFunction, createProbot } from '@probot/adapter-aws-lambda-serverless';

import app from '../src/index';


export const handler = createLambdaFunction(app, {
    probot: createProbot(),
});
  
import { createLambdaFunction, createProbot } from '@probot/adapter-aws-lambda-serverless';

import {bot} from '../src/bot';


export const handler = createLambdaFunction(bot, {
    probot: createProbot(),
});
  
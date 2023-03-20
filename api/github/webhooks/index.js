import { Probot, createNodeMiddleware, createProbot } from "probot";

import {bot} from "../../../src/bot";

const appIdOptions = {
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    secret: process.env.WEBHOOK_SECRET,
}

console.log(typeof bot);

const probot = new Probot({
    ...appIdOptions,
});


export default createNodeMiddleware(bot, { probot, webhooksPath: '/api/github/webhooks' });
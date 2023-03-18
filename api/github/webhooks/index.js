import { Probot, createNodeMiddleware, createProbot } from "probot";

import app from "../../../src/index";


const APP_ID=305149


const probot = new Probot({
    appId: APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    secret: process.env.WEBHOOK_SECRET,
    webhookPath: "/api/github/webhooks",
    webhookProxy: process.env.WEBHOOK_PROXY_URL,
});// Set the appId option for probot
probot.load(app, { appId: process.env.APP_ID });

export default createNodeMiddleware(app, 
    { probot, webhooksPath: '/api/github/webhooks' });
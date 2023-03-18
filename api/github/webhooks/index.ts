import { Probot, createNodeMiddleware, createProbot } from "probot";

import app from "../../../src/index";


const APP_ID=305149


const appIdOptions = {
    appId: APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    secret: process.env.WEBHOOK_SECRET,
}


const probot = new Probot({
    ...appIdOptions,
});



export default createNodeMiddleware(app, 
    { probot, webhooksPath: '/api/github/webhooks' });
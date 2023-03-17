import { Probot, createNodeMiddleware, createProbot } from "probot";

import {app} from "../../../src/index";

// const probot = createProbot(
//     {
//         APP_ID: process.env.APP_ID,
//         PRIVATE_KEY: process.env.PRIVATE_KEY,
//         WEBHOOK_PROXY_URL: process.env.WEBHOOK_PROXY_URL,
//         GITHUB_TOKEN: process.env.GITHUB_TOKEN,
//     },
// );

const probot = new Probot({
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    githubToken: process.env.GITHUB_TOKEN,
});

export default createNodeMiddleware(app, { probot, webhooksPath: '/api/github/webhooks' });
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var chat_1 = require("./chat");
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var MODEL = process.env.MODEL;
var PROMPT = process.env.PROMPT;
var LANG = process.env.LANGUGAGE;
var MAX_PATCH_COUNT = 4000;
module.exports = function (app) {
    var loadChat = function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var repo, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (OPENAI_API_KEY) {
                        return [2 /*return*/, new chat_1.Chat(OPENAI_API_KEY, MODEL, LANG, PROMPT)];
                    }
                    repo = context.repo();
                    app.log(repo);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, context.octokit.request("GET /repos/{owner}/{repo}/actions/variables/{name}", {
                            owner: repo.owner,
                            repo: repo.repo,
                            name: OPENAI_API_KEY,
                        })];
                case 2:
                    data = (_b.sent()).data;
                    if (!(data === null || data === void 0 ? void 0 : data.value)) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, new chat_1.Chat(data.value, MODEL, LANG, PROMPT)];
                case 3:
                    _a = _b.sent();
                    return [4 /*yield*/, context.octokit.issues.createComment({
                            repo: repo.repo,
                            owner: repo.owner,
                            issue_number: context.pullRequest().pull_number,
                            body: "Seems you are using me but didn't get OPENAI_API_KEY seted in Variables/Secrets for this repo. you could follow [readme](https://github.com/anc95/ChatGPT-CodeReview) for more information",
                        })];
                case 4:
                    _b.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    app.on(['pull_request.opened', 'pull_request.synchronize'], function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var chat, repo, pull_request, data, _a, changedFiles, commits, files, filesNames_1, i, file, patch, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadChat(context)];
                case 1:
                    chat = _b.sent();
                    repo = context.repo();
                    if (!chat) {
                        return [2 /*return*/, "chat not loaded"];
                    }
                    pull_request = context.payload.pull_request;
                    if (pull_request.state === "closed" ||
                        pull_request.locked ||
                        pull_request.draft) {
                        return [2 /*return*/, "invalid event paylod"];
                    }
                    return [4 /*yield*/, context.octokit.repos.compareCommits({
                            owner: repo.owner,
                            repo: repo.repo,
                            base: context.payload.pull_request.base.sha,
                            head: context.payload.pull_request.head.sha,
                        })];
                case 2:
                    data = _b.sent();
                    _a = data.data, changedFiles = _a.files, commits = _a.commits;
                    if (!(context.payload.action === 'synchronize')) return [3 /*break*/, 4];
                    app.log('synchronize');
                    if (!(commits.length >= 2)) return [3 /*break*/, 4];
                    return [4 /*yield*/, context.octokit.repos.compareCommits({
                            owner: repo.owner,
                            repo: repo.repo,
                            base: commits[commits.length - 2].sha,
                            head: commits[commits.length - 1].sha,
                        })];
                case 3:
                    files = (_b.sent()).data.files;
                    filesNames_1 = (files === null || files === void 0 ? void 0 : files.map(function (file) { return file.filename; })) || [];
                    changedFiles = changedFiles === null || changedFiles === void 0 ? void 0 : changedFiles.filter(function (file) {
                        return filesNames_1.includes(file.filename);
                    });
                    _b.label = 4;
                case 4:
                    if (!(changedFiles === null || changedFiles === void 0 ? void 0 : changedFiles.length)) {
                        return [2 /*return*/, 'no change'];
                    }
                    console.time('gpt cost');
                    i = 0;
                    _b.label = 5;
                case 5:
                    if (!(i < changedFiles.length)) return [3 /*break*/, 9];
                    file = changedFiles[i];
                    patch = file.patch || '';
                    if (!patch || patch.length > MAX_PATCH_COUNT) {
                        return [3 /*break*/, 8];
                    }
                    return [4 /*yield*/, (chat === null || chat === void 0 ? void 0 : chat.codeReview(patch))];
                case 6:
                    res = _b.sent();
                    app.log(res);
                    if (!!!res) return [3 /*break*/, 8];
                    app.log("start to send comments");
                    app.log(res);
                    return [4 /*yield*/, context.octokit.pulls.createReviewComment({
                            repo: repo.repo,
                            owner: repo.owner,
                            pull_number: context.pullRequest().pull_number,
                            commit_id: commits[commits.length - 1].sha,
                            path: file.filename,
                            body: res,
                            position: patch.split('\n').length - 1,
                        })];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 5];
                case 9:
                    console.timeEnd('gpt cost');
                    console.info('suceess reviewed', context.payload.pull_request.html_url);
                    return [2 /*return*/, "success"];
            }
        });
    }); });
    // For more information on building apps:
    // https://probot.github.io/docs/
    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
//# sourceMappingURL=index.js.map
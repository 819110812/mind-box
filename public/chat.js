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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
// import fetch from 'node-fetch';
var axios_1 = __importDefault(require("axios"));
// import { HttpsProxyAgent } from 'https-proxy-agent';
// import { Configuration, OpenAIApi } from 'openai';
var Chat = /** @class */ (function () {
    // private configuration = (apikey: string) => {
    //   const config = new Configuration({
    //     apiKey: apikey,
    //   });
    //   return config;
    // };
    function Chat(apikey, model, language, prompt) {
        var _this = this;
        this.defaultPrompt = "Bellow is the code patch, please help me do a brief code review, if any bug risk and improvement suggestion are welcome";
        this.defaultModel = "gpt-3.5-turbo";
        this.generatePrompt = function (patch) {
            if (_this.prompt) {
                return _this.prompt + patch;
            }
            return "".concat(_this.defaultPrompt, " ").concat(patch);
        };
        this.codeReview = function (patch) { return __awaiter(_this, void 0, void 0, function () {
            var prompt, lang, res, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!patch) {
                            return [2 /*return*/, ''];
                        }
                        console.time('code-review cost');
                        prompt = this.generatePrompt(patch);
                        lang = this.language;
                        if (lang) {
                            prompt = prompt + "\nAnswer me in ".concat(lang);
                        }
                        prompt = prompt + ' do not repeat my words, give me answer directly';
                        console.log("prompt is ", prompt);
                        // const res = await this.chatAPI.sendMessage(prompt, {
                        //   promptPrefix: 'hi,',
                        //   promptSuffix: `\nlet's start` + (lang ? ', Answer me in ${lang}' : ''),
                        // });
                        if (!this.model) {
                            // default model
                            this.model = this.defaultModel;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log(this.apiKey);
                        return [4 /*yield*/, axios_1.default.post("https://api.openai.com/v1/chat/completions", {
                                'model': this.model,
                                "messages": [{ "role": "user", "content": prompt }],
                            }, {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer ".concat(this.apiKey),
                                }
                            })];
                    case 2:
                        res = _a.sent();
                        data = res.data;
                        console.timeEnd('code-review cost');
                        console.log("get review from chatgpt ", data);
                        console.log(data);
                        // remove redundant words which already in prompt
                        return [2 /*return*/, data.choices[0].message.content];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.model = model;
        this.language = language;
        this.prompt = prompt;
        // this.openAiApi = new OpenAIApi(this.configuration(apikey));
        this.apiKey = apikey;
    }
    return Chat;
}());
exports.Chat = Chat;
//# sourceMappingURL=chat.js.map
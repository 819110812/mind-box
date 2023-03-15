export declare class Chat {
    private model;
    private language;
    private prompt;
    private defaultPrompt;
    private defaultModel;
    private apiKey;
    constructor(apikey: string, model: any, language: any, prompt: any);
    private generatePrompt;
    codeReview: (patch: string) => Promise<any>;
}

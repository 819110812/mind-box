// import fetch from 'node-fetch';
import axios from 'axios';
// import { HttpsProxyAgent } from 'https-proxy-agent';
// import { Configuration, OpenAIApi } from 'openai';

export class Chat {
  // private openAiApi: OpenAIApi
  private model : string;
  private language : string;
  private prompt : string;
  private defaultPrompt = `Bellow is the code patch, please help me do a brief code review, if any bug risk and improvement suggestion are welcome`;
  private defaultModel = `gpt-3.5-turbo`;
  private apiKey: string

  // private configuration = (apikey: string) => {
  //   const config = new Configuration({
  //     apiKey: apikey,
  //   });
  //   return config;
  // };



  constructor(apikey: string, 
    model: any, 
    language: any, 
    prompt: any) {
    this.model = model;
    this.language = language;
    this.prompt = prompt;
    // this.openAiApi = new OpenAIApi(this.configuration(apikey));
    this.apiKey = apikey;

  }

  private generatePrompt = (patch: string) => {
    if (this.prompt) {
      return this.prompt + patch;
    }

    return `${this.defaultPrompt} ${patch}`

  };

  public codeReview = async (patch: string) => {
    if (!patch) {
      return '';
    }

    console.time('code-review cost');
    let prompt = this.generatePrompt(patch);
    const lang = this.language;

    if (lang) {
      prompt = prompt + `\nAnswer me in ${lang}`;
    }

    prompt = prompt + ' do not repeat my words, give me answer directly'

    console.log("prompt is ", prompt)

    // const res = await this.chatAPI.sendMessage(prompt, {
    //   promptPrefix: 'hi,',
    //   promptSuffix: `\nlet's start` + (lang ? ', Answer me in ${lang}' : ''),
    // });


    if (!this.model) {
      // default model
      this.model = this.defaultModel;
    }

    // let body = {}
    // if (this.model) {
    //   body = {
    //     "model": this.model,
    //     "prompt": prompt,
    //   }
    // } else {
    //   body = {
    //     "messages": [{"role": "user", "content": prompt}],
    //     "model": this.model,
    //   }
    // }


    try {
      console.log(this.apiKey)
      // http proxy 
      // const httpAgent = new HttpsProxyAgent("http://127.0.0.1:7890")

      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          'model': this.model,
          "messages": [{"role": "user", "content": prompt}],
        },
         {
          headers: {
            "Content-Type":"application/json",
            "Authorization": `Bearer ${this.apiKey}`,
          }
         }
      );


      // const res = await fetch(
      //   'https://api.openai.com/v1/chat/completions',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${this.apiKey}`,
      //     },
      //     body: JSON.stringify(body),
      //   }
      // );

      const data = res.data

      console.timeEnd('code-review cost');

      console.log("get review from chatgpt ", data);
      
      console.log(data);
      
      

      // remove redundant words which already in prompt

      
      return data.choices[0].message.content;

      // const res = await this.openAiApi.createCompletion({
      //   model: this.model,
      //   prompt: prompt,
      // });

      // if (!res) {
      //   return '';
      // }
  
      // if (res.status !== 200) {
      //   // print response body
      //   console.log(res.data);
      //   return '';
      // }

      // console.timeEnd('code-review cost');

      // return res.data.choices[0].text;

    } catch (error) {
      console.log(error);
      return '';
    }
  };
}
import { Context, Probot } from "probot";
import { Chat } from "./chat";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.MODEL;
const PROMPT = process.env.PROMPT;
const LANG = process.env.LANGUGAGE;
const MAX_PATCH_COUNT = 4000;

export = (app: Probot) => {
  const loadChat = async (context: Context) => {
    if (OPENAI_API_KEY) {
      return new Chat(OPENAI_API_KEY, MODEL, LANG, PROMPT);
    }

    const repo = context.repo();

    app.log(repo);
    try {
      const { data } = (await context.octokit.request(
        "GET /repos/{owner}/{repo}/actions/variables/{name}",
        {
          owner: repo.owner,
          repo: repo.repo,
          name: OPENAI_API_KEY,
        }
      )) as any;

      if (!data?.value) {
        return null;
      }

      return new Chat(data.value, MODEL, LANG, PROMPT);
    } catch {
      await context.octokit.issues.createComment({
        repo: repo.repo,
        owner: repo.owner,
        issue_number: context.pullRequest().pull_number,
        body: `Seems you are using me but didn't get OPENAI_API_KEY seted in Variables/Secrets for this repo. you could follow [readme](https://github.com/anc95/ChatGPT-CodeReview) for more information`,
      });
      return null;
    }
  };

  app.on(
    ['pull_request.opened', 'pull_request.synchronize'],
    async (context) => {
      const chat = await loadChat(context);
      const repo = context.repo();

      if (!chat) {
        return "chat not loaded";
      }

      // app.log(context.payload.pull_request)

      // return "chat loaded";

      const pull_request = context.payload.pull_request;
    
      if (
        pull_request.state === "closed" ||
        pull_request.locked ||
        pull_request.draft
      ) {
        return "invalid event paylod";
      }

      const data = await context.octokit.repos.compareCommits({
        owner: repo.owner,
        repo: repo.repo,
        base: context.payload.pull_request.base.sha,
        head: context.payload.pull_request.head.sha,
      });



      let { files: changedFiles, commits } = data.data;

      if (context.payload.action === 'synchronize') {
        app.log('synchronize');
        if (commits.length >= 2) {
          const {
            data: { files },
          } = await context.octokit.repos.compareCommits({
            owner: repo.owner,
            repo: repo.repo,
            base: commits[commits.length - 2].sha,
            head: commits[commits.length - 1].sha,
          });

          const filesNames = files?.map((file) => file.filename) || [];
          changedFiles = changedFiles?.filter((file) =>
            filesNames.includes(file.filename)
          );
        }
      }

      if (!changedFiles?.length) {
        return 'no change';
      }

      console.time('gpt cost');

      for (let i = 0; i < changedFiles.length; i++) {
        const file = changedFiles[i];
        const patch = file.patch || '';

        if (!patch || patch.length > MAX_PATCH_COUNT) {
          continue;
        }
        const res = await chat?.codeReview(patch);
        app.log(res)

        if (!!res) {
          app.log("start to send comments")
          app.log(res)
          await context.octokit.pulls.createReviewComment({
            repo: repo.repo,
            owner: repo.owner,
            pull_number: context.pullRequest().pull_number,
            commit_id: commits[commits.length - 1].sha,
            path: file.filename,
            body: res,
            position: patch.split('\n').length - 1,
          });
        }
      }

      console.timeEnd('gpt cost');
      console.info('suceess reviewed', context.payload.pull_request.html_url);

      return "success";
    }
  );
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};

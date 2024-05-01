import { getEnvVariable } from "@event-driven-agents/helpers";
import { App, AwsLambdaReceiver } from "@slack/bolt";

export const instantiateApp = (): {
  app: App;
  awsLambdaReceiver: AwsLambdaReceiver;
} => {
  const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: getEnvVariable("SLACK_SIGNING_SECRET"),
  });

  const app = new App({
    token: getEnvVariable("SLACK_BOT_TOKEN"),
    receiver: awsLambdaReceiver,
  });

  return { app, awsLambdaReceiver };
};

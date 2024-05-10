import { getEnvVariable } from "@event-driven-agents/helpers";
import { App, AwsLambdaReceiver } from "@slack/bolt";

export const SlackAppAdapter = (
  accessToken: string
): {
  app: App;
  awsLambdaReceiver: AwsLambdaReceiver;
} => {
  const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: getEnvVariable("SLACK_SIGNING_SECRET"),
  });

  const app = new App({
    token: accessToken,
    receiver: awsLambdaReceiver,
  });

  return { app, awsLambdaReceiver };
};

import { SSMClient } from "@aws-sdk/client-ssm";
import { SlackAppAdapter } from "@event-driven-agents/adapters";
import { getRegion, SendSlackMessageEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";

const ssm = new SSMClient({ region: getRegion() });

export const handler = async (
  event: EventBridgeEvent<"slack.send.message", SendSlackMessageEvent>
) => {
  const { accessToken, message, channel } = event.detail;

  const { app, awsLambdaReceiver } = SlackAppAdapter(accessToken);

  await app.client.chat.postMessage({
    token: accessToken,
    channel,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message,
        },
      },
    ],
  });

  await awsLambdaReceiver.start();
};

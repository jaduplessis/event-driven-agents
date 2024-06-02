import { SSMClient } from "@aws-sdk/client-ssm";
import { SlackAppAdapter } from "@event-driven-agents/adapters";
import { getRegion, SendMessageEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";

const ssm = new SSMClient({ region: getRegion() });

export const handler = async (
  event: EventBridgeEvent<"send.message", SendMessageEvent>
) => {
  const { core, currentTool } = event.detail;
  const { accessToken, channel } = core;
  if (channel === undefined) {
    throw new Error("Channel is required to send a message");
  }
  const message = currentTool.args.message;

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

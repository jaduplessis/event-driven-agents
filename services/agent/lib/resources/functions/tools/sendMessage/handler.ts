import { SlackAppAdapter } from "@event-driven-agents/adapters";
import { sendMessageSchema, ToolEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { core } = event.detail;
  const { currentTool } = event.detail.toolDetails;
  const { accessToken, channel } = core;
  if (channel === undefined) {
    throw new Error("Channel is required to send a message");
  }
  const { message } = sendMessageSchema.parse(currentTool.function.arguments);

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

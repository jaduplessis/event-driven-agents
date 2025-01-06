import { SlackAppAdapter } from "@event-driven-agents/adapters";

import { EventBridgeEvent } from "aws-lambda";
import { sendMessageSchema, ToolEvent } from "../../../dataModel";

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { core } = event.detail;
  const { currentTool } = event.detail.toolDetails;
  const { accessToken, channel, ts } = core;
  if (channel === undefined) {
    throw new Error("Channel is required to send a message");
  }
  const { message } = sendMessageSchema.parse(currentTool.function.arguments);

  const { app, awsLambdaReceiver } = SlackAppAdapter(accessToken);

  await app.client.chat.postMessage({
    token: accessToken,
    channel,
    thread_ts: ts,
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

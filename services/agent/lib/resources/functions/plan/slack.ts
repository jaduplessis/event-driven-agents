import { MessageEvent } from "@event-driven-agents/helpers";
import { GenericMessageEvent } from "@slack/bolt";
import { EventBridgeEvent } from "aws-lambda";
import { createMessage, getMessage } from "../../dataModel";

export const processSlackMessage = async (
  event: EventBridgeEvent<"agent.plan", MessageEvent>
) => {
  const { core } = event.detail;
  const message = event.detail.schema.message as GenericMessageEvent;

  if (message === undefined || message.text === undefined) {
    throw new Error("Message text is required");
  }
  const { text, ts, thread_ts, channel, user } = message;

  try {
    await getMessage({ thread_ts, message_ts: ts });
    throw new Error("Message already processed");
  } catch (error) {
    console.log("Message not found. New message to process");
  }

  return await createMessage({
    messageKeys: { thread_ts, message_ts: ts },
    message: { teamId: core.teamId, channel, text, user },
  });
};

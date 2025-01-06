import { MessageEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { createMessage, getMessage } from "../../dataModel";

export const processSlackMessage = async (
  event: EventBridgeEvent<"agent.plan", MessageEvent>
) => {
  const { core } = event.detail;
  const { message } = event.detail.schema;

  if (message === undefined || message.text === undefined) {
    throw new Error("Message text is required");
  }
  const { text, ts, thread_ts, channel } = message;

  if (thread_ts !== undefined) {
    throw new Error("Threaded messages are not supported");
  }

  try {
    await getMessage(ts);
    throw new Error("Message already processed");
  } catch (error) {
    createMessage({ ts, teamId: core.teamId, channel, text, thread_ts });
  }

  return { text, channel, ts };
};

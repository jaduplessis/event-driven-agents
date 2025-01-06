import { MessageEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { MessageEntity } from "../../dataModel";

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

  const messageEntity = await MessageEntity.get({
    PK: ts,
    SK: "ROOT",
  });

  if (messageEntity.Item) {
    throw new Error("Message already processed");
  } else {
    await MessageEntity.update({
      messageTs: ts,
      teamId: core.teamId,
    });
  }

  return { text, channel };
};

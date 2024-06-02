import { SSMClient } from "@aws-sdk/client-ssm";
import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import {
  BaseResponse,
  getRegion,
  MessageEvent,
  SendSlackMessageEvent,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { MessageEntity } from "../../dataModel";
import { loadSsmValues } from "../utils/ssm";
import { stringJson } from "./dummyData/event";

const ssm = new SSMClient({ region: getRegion() });
const eventBridge = new EventBridgeAdapter();

export const handler = async (
  event: EventBridgeEvent<"message.received", MessageEvent>
) => {
  const { core } = event.detail;
  const { message } = event.detail.schema;

  await loadSsmValues(ssm, core.teamId);

  if (message === undefined || message.text === undefined) {
    return;
  }
  const { text, channel, ts, thread_ts } = message;

  if (thread_ts !== undefined) {
    return;
  }

  const messageEntity = await MessageEntity.get({
    PK: ts,
    SK: "ROOT",
  });

  if (messageEntity.Item) {
    return;
  } else {
    await MessageEntity.update({
      messageTs: ts,
      teamId: core.teamId,
    });
  }

  const dummyResponse = stringJson(text);
  const dummyEvent = JSON.parse(dummyResponse) as BaseResponse;

  const eventDetail: SendSlackMessageEvent = {
    core,
    schema: {
      channel,
      ...dummyEvent.toolOptions,
    },
  };

  await eventBridge.putEvent(
    "agent.brain",
    {
      ...eventDetail,
    },
    dummyEvent.toolName
  );
};

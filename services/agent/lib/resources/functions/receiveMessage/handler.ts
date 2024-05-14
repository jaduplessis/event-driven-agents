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
  const { accessToken, user_id, teamId, message } = event.detail;

  await loadSsmValues(ssm, teamId);

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
      teamId,
    });
  }

  const dummyResponse = stringJson(text);
  const dummyEvent = JSON.parse(dummyResponse) as BaseResponse;

  const eventDetail: SendSlackMessageEvent = {
    accessToken,
    user_id,
    channel,
    teamId,
    ...dummyEvent.detail,
  };

  await eventBridge.putEvent(
    "agent.brain",
    {
      ...eventDetail,
    },
    dummyEvent.detailType
  );
};

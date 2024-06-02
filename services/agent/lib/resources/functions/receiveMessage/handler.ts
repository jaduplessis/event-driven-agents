import { SSMClient } from "@aws-sdk/client-ssm";
import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import {
  getEnvVariable,
  getRegion,
  MessageEvent,
  sendMessageDefinition,
  ToolEvent,
  ToolRequest,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { MessageEntity } from "../../dataModel";
import { invoke } from "../utils/invoke";
import { loadSsmValues } from "../utils/ssm";
import { constructSystemPrompt } from "./system";

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

  const systemPrompt = constructSystemPrompt([sendMessageDefinition]);
  const humanPrompt = text;
  const modelConfig = {
    apiKey: getEnvVariable("OPENAI_API_KEY"),
    model: "gpt-4o",
    temperature: 1,
    maxTokens: 500,
  };

  const response = await invoke({ systemPrompt, humanPrompt, modelConfig });

  const tools = JSON.parse(response) as ToolRequest[];
  const currentTool = tools.shift();

  if (currentTool === undefined) {
    throw new Error("No tool found");
  }

  const eventDetail: ToolEvent = {
    core: {
      ...core,
      channel,
    },
    currentTool,
    followingTools: tools,
  };

  await eventBridge.putEvent(
    "agent.brain",
    {
      ...eventDetail,
    },
    currentTool.tool
  );
};

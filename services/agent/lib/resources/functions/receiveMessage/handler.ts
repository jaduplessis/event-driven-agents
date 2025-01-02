import { SSMClient } from "@aws-sdk/client-ssm";
import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import {
  getEnvVariable,
  getRegion,
  MessageEvent,
  sendMessageDefinition,
  ToolEvent,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { MessageEntity } from "../../dataModel";
import { generateTasksList } from "../utils/generateTasksList";
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

  const toolsList = await generateTasksList({
    systemPrompt,
    humanPrompt,
  });

  const [currentTool, ...followingTools] = toolsList.steps;

  const eventDetail: ToolEvent = {
    core: {
      ...core,
      channel,
    },
    currentTool,
    followingTools,
  };

  await eventBridge.putEvent(
    "agent.brain",
    {
      ...eventDetail,
    },
    `tools.${currentTool.function.name}`
  );
};

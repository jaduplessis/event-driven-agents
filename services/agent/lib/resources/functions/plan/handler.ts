import { SSMClient } from "@aws-sdk/client-ssm";
import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import {
  getRegion,
  MessageEvent,
  queryTescoDefinition,
  sendMessageDefinition,
  ToolEvent,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { generateTasksList } from "../utils/generateTasksList";
import { loadSsmValues } from "../utils/ssm";
import { processSlackMessage } from "./message";
import { constructSystemPrompt } from "./system";

const ssm = new SSMClient({ region: getRegion() });
const eventBridge = new EventBridgeAdapter();

export const handler = async (
  event: EventBridgeEvent<"agent.plan", MessageEvent>
) => {
  const { core } = event.detail;
  await loadSsmValues(ssm, core.teamId);

  let slackMessageDetails;
  try {
    slackMessageDetails = await processSlackMessage(event);
  } catch (error) {
    console.error(error);
    return;
  }
  const { text, channel } = slackMessageDetails;

  const systemPrompt = constructSystemPrompt();
  const tools = [sendMessageDefinition, queryTescoDefinition];

  console.log(`Tools: ${JSON.stringify(tools, null, 2)}`);

  const toolsList = await generateTasksList({
    systemPrompt,
    humanPrompt: text,
    tools,
  });

  console.log(
    `Plan to run tools and configurations: ${JSON.stringify(toolsList, null, 2)}`
  );

  const [currentTool, ...followingTools] = toolsList;
  const eventDetail: ToolEvent = {
    ...event.detail,
    core: {
      ...core,
      channel,
    },
    processingStep: 0,
    message: text,
    toolDetails: {
      previousTools: [],
      planResults: [],
      currentTool,
      followingTools,
    },
  };

  await eventBridge.putEvent(
    "agent.brain",
    {
      ...eventDetail,
    },
    `tools.${currentTool.function.name}`
  );
};

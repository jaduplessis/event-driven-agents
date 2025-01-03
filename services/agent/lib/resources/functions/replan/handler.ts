import { SSMClient } from "@aws-sdk/client-ssm";
import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import {
  getRegion,
  queryTescoDefinition,
  sendMessageDefinition,
  ToolEvent,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { evaluatePlan } from "../utils/evaluatePlan";
import { loadSsmValues } from "../utils/ssm";
import { constructSystemPrompt } from "./system";

const ssm = new SSMClient({ region: getRegion() });
const eventBridge = new EventBridgeAdapter();

const MAX_STEPS = 5;

export const handler = async (
  event: EventBridgeEvent<"agent.replan", ToolEvent>
) => {
  const { core, message } = event.detail;

  if (event.detail.previousTools.length >= MAX_STEPS) {
    console.log("Max steps reached");
    return;
  }

  await loadSsmValues(ssm, core.teamId);

  const systemPrompt = constructSystemPrompt({
    input: message,
    plan: JSON.stringify(event.detail.previousTools, null, 2),
    planResults: JSON.stringify(event.detail.planResults, null, 2),
  });
  const tools = [sendMessageDefinition, queryTescoDefinition];

  console.log(`Tools: ${JSON.stringify(tools, null, 2)}`);

  const toolsList = await evaluatePlan({
    systemPrompt,
    tools,
  });

  console.log(
    `Plan to run tools and configurations: ${JSON.stringify(toolsList, null, 2)}`
  );

  const [currentTool, ...followingTools] = toolsList;

  const eventDetail: ToolEvent = {
    ...event.detail,
    currentTool,
    followingTools,
  };

  console.log(`Event Detail: ${JSON.stringify(eventDetail, null, 2)}`);

  await eventBridge.putEvent(
    "agent.brain",
    {
      ...eventDetail,
    },
    `tools.${currentTool.function.name}`
  );
};

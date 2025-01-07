import { SSMClient } from "@aws-sdk/client-ssm";
import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import { getRegion } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import {
  ToolEvent,
  queryTescoDefinition,
  sendMessageDefinition,
  updateBasketTescoDefinition,
} from "../../dataModel";
import { evaluatePlan } from "../utils/evaluatePlan";
import { loadSsmValues } from "../utils/ssm";
import { constructSystemPrompt } from "./system";

const ssm = new SSMClient({ region: getRegion() });
const eventBridge = new EventBridgeAdapter();

const MAX_STEPS = 5;

export const handler = async (
  event: EventBridgeEvent<"agent.replan", ToolEvent>
) => {
  const { core, message, toolDetails } = event.detail;
  const { previousTools, planResults } = toolDetails;

  await loadSsmValues(ssm, core.teamId);

  const systemPrompt = constructSystemPrompt({
    input: message,
    plan: JSON.stringify(previousTools, null, 2),
    planResults: JSON.stringify(planResults, null, 2),
  });
  const tools = [
    sendMessageDefinition,
    queryTescoDefinition,
    updateBasketTescoDefinition,
  ];

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
    toolDetails: {
      planResults,
      previousTools,
      currentTool,
      followingTools,
    },
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

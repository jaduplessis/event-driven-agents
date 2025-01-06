import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import { queryTescoSchema, ToolEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { queryTesco } from "./tesco";

const eventBridge = new EventBridgeAdapter();

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { previousTools, currentTool, followingTools, planResults } =
    event.detail.toolDetails;

  const { query } = queryTescoSchema.parse(currentTool.function.arguments);

  const queryResults = await queryTesco(query);

  const updatedPlanResults = [
    ...planResults,
    JSON.stringify(queryResults, null, 2),
  ];

  console.log(JSON.stringify(queryResults, null, 2));

  const [nextTool, ...remainingTools] = followingTools;
  const pastTools = [...previousTools, currentTool];

  const eventDetail: ToolEvent = {
    ...event.detail,
    toolDetails: {
      planResults: updatedPlanResults,
      previousTools: pastTools,
      currentTool: nextTool,
      followingTools: remainingTools,
    },
  };

  let source = "";
  let detailType = "";
  if (nextTool) {
    source = `tools.${currentTool.function.name}`;
    detailType = `tools.${nextTool.function.name}`;
  } else {
    source = "plan.end";
    detailType = "agent.replan";
  }

  await eventBridge.putEvent(
    source,
    {
      ...eventDetail,
    },
    detailType
  );
};

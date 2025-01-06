import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import { EventBridgeEvent } from "aws-lambda";
import { ToolEvent } from "../../../dataModel";

const eventBridge = new EventBridgeAdapter();

export const postEvent = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>,
  queryResults: string
) => {
  const { previousTools, currentTool, followingTools, planResults } =
    event.detail.toolDetails;

  const updatedPlanResults = [...planResults, queryResults];

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

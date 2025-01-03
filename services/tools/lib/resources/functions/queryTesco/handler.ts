import { queryTescoSchema, ToolEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { queryTesco } from "./tesco";

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { core, currentTool } = event.detail;

  const { query } = queryTescoSchema.parse(currentTool.function.arguments);

  const queryResults = await queryTesco(query);

  console.log(JSON.stringify(queryResults, null, 2));

  return {
    core,
    currentTool: {
      ...currentTool,
      function: {
        ...currentTool.function,
        result: queryResults,
      },
    },
  };
};

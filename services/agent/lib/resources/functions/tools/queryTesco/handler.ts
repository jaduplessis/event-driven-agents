import { EventBridgeEvent } from "aws-lambda";
import {
  createToolUse,
  queryTescoSchema,
  ToolEvent,
  Tools,
} from "../../../dataModel";
import { postEvent } from "./eventbus";
import { queryTesco } from "./tesco";

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { thread_ts } = event.detail;
  const { currentTool } = event.detail.toolDetails;

  const { query } = queryTescoSchema.parse(currentTool.function.arguments);

  const queryResults = await queryTesco(query);

  await createToolUse({
    thread_ts,
    type: Tools.queryTesco,
    properties: JSON.stringify({ query }),
    results: queryResults,
  });

  await postEvent(event, queryResults);
};

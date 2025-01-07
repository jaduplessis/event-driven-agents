import { EventBridgeEvent } from "aws-lambda";
import {
  createToolUse,
  ToolEvent,
  Tools,
  updateBasketTescoSchema,
} from "../../../dataModel";
import { postToolEvent } from "../../utils/postToolEvent";
import { updateBasket } from "./tesco";

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { thread_ts } = event.detail;
  const { currentTool } = event.detail.toolDetails;

  const { id, quantity } = updateBasketTescoSchema.parse(
    currentTool.function.arguments
  );

  let updateBasketResults;
  try {
    updateBasketResults = await updateBasket(id, quantity);
  } catch (error) {
    updateBasketResults = error as string;
  }

  await createToolUse({
    thread_ts,
    type: Tools.updateBasketTesco,
    properties: JSON.stringify({ id, quantity }),
    results: updateBasketResults,
  });

  await postToolEvent(event, updateBasketResults);
};

import { SSMClient } from "@aws-sdk/client-ssm";
import { getRegion } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import {
  createToolUse,
  ToolEvent,
  Tools,
  updateBasketDynamoSchema,
  updateBasketItem,
} from "../../../dataModel";
import { getBasketDate, postToolEvent } from "../../utils";

const ssm = new SSMClient({ region: getRegion() });

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { thread_ts } = event.detail;
  const { currentTool } = event.detail.toolDetails;

  const basketDate = getBasketDate();
  const { user, id, quantity, unitPrice, title } =
    updateBasketDynamoSchema.parse(currentTool.function.arguments);

  const basketItem = await updateBasketItem({
    basketDate,
    user,
    id,
    title,
    quantity,
    unitPrice,
  });

  const results = JSON.stringify({ message: "success", basketItem });

  await createToolUse({
    thread_ts,
    type: Tools.updateBasketTesco,
    properties: JSON.stringify({ id, quantity }),
    results,
  });

  await postToolEvent(event, results);
};

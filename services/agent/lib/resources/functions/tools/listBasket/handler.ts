import { SSMClient } from "@aws-sdk/client-ssm";
import { getRegion } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import {
  createToolUse,
  listAllBasketItems,
  listBasketSchema,
  ToolEvent,
  Tools,
} from "../../../dataModel";
import { getBasketDate, postToolEvent } from "../../utils";

const ssm = new SSMClient({ region: getRegion() });

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { thread_ts } = event.detail;
  const { currentTool } = event.detail.toolDetails;
  const { user } = listBasketSchema.parse(currentTool.function.arguments);

  const basketDate = getBasketDate();

  const basketItems = await listAllBasketItems({ basketDate, user });

  const results = JSON.stringify({ basketItems });

  await createToolUse({
    thread_ts,
    type: Tools.updateBasketTesco,
    properties: JSON.stringify({ user }),
    results,
  });

  await postToolEvent(event, results);
};

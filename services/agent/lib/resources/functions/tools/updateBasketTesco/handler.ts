import { SSMClient } from "@aws-sdk/client-ssm";
import {
  buildResourceName,
  getParameter,
  getRegion,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import {
  createToolUse,
  ToolEvent,
  Tools,
  updateBasketTescoSchema,
} from "../../../dataModel";
import { postToolEvent } from "../../utils";
import { updateBasket } from "./tesco";

const ssm = new SSMClient({ region: getRegion() });

export const handler = async (
  event: EventBridgeEvent<`tools.*`, ToolEvent>
) => {
  const { thread_ts } = event.detail;
  const { currentTool } = event.detail.toolDetails;

  const { id, quantity } = updateBasketTescoSchema.parse(
    currentTool.function.arguments
  );

  const bearerToken = await getParameter(
    ssm,
    buildResourceName("tesco-bearer-token"),
    true
  );
  if (!bearerToken) {
    throw new Error("Bearer token not found");
  }

  let updateBasketResults;
  try {
    updateBasketResults = await updateBasket(id, quantity, bearerToken);
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

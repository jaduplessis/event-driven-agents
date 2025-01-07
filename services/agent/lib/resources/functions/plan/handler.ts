import { SSMClient } from "@aws-sdk/client-ssm";
import { EventBridgeAdapter } from "@event-driven-agents/adapters";
import { getRegion, MessageEvent } from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import {
  queryTescoDefinition,
  sendMessageDefinition,
  ToolEvent,
  updateBasketTescoDefinition,
} from "../../dataModel";
import { generateTasksList } from "../utils/generateTasksList";
import { loadSsmValues } from "../utils/ssm";
import { constructMessages } from "./messages";
import { processSlackMessage } from "./slack";

const ssm = new SSMClient({ region: getRegion() });
const eventBridge = new EventBridgeAdapter();

export const handler = async (
  event: EventBridgeEvent<"agent.plan", MessageEvent>
) => {
  try {
    const { core } = event.detail;
    await loadSsmValues(ssm, core.teamId);

    const { text, channel, thread_ts } = await processSlackMessage(event);

    const messages = await constructMessages(thread_ts);
    const tools = [
      sendMessageDefinition,
      queryTescoDefinition,
      updateBasketTescoDefinition,
    ];

    const toolsList = await generateTasksList({
      messages,
      tools,
    });

    console.log(
      `Plan to run tools and configurations: ${JSON.stringify(toolsList, null, 2)}`
    );

    const [currentTool, ...followingTools] = toolsList;
    const eventDetail: ToolEvent = {
      ...event.detail,
      core: {
        ...core,
        channel,
      },
      processingStep: 0,
      thread_ts,
      message: text,
      toolDetails: {
        previousTools: [],
        planResults: [],
        currentTool,
        followingTools,
      },
    };

    await eventBridge.putEvent(
      "agent.brain",
      {
        ...eventDetail,
      },
      `tools.${currentTool.function.name}`
    );
  } catch (error) {
    console.error(error);
  }
};

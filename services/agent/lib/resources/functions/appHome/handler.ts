import { SSMClient } from "@aws-sdk/client-ssm";
import { SlackAppAdapter } from "@event-driven-agents/adapters";
import {
  AppHomeOpenedEvent,
  getParameter,
  getRegion,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";
import { createHome } from "./appHome";

const ssm = new SSMClient({ region: getRegion() });

export const handler = async (
  event: EventBridgeEvent<"app.home.opened", AppHomeOpenedEvent>
) => {
  const { accessToken, teamId, token, user_id } = event.detail;
  const { app, awsLambdaReceiver } = SlackAppAdapter(accessToken);

  const apiKey = await getParameter(
    ssm,
    `api-keys/${teamId}/OPENAI_API_KEY`,
    true
  );

  const homeView = createHome(apiKey);

  try {
    await app.client.views.publish({
      token,
      user_id,
      view: homeView,
    });
  } catch (e) {
    console.error(e);
  }

  await awsLambdaReceiver.start();
};

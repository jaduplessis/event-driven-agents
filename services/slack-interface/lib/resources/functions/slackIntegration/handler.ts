import { APIGatewayProxyHandler } from "aws-lambda";

import { EventBridgeAdapter, SlackAppAdapter } from "@event-driven-agents/adapters";
import { getAccessToken } from "../utils";

const eventBridge = new EventBridgeAdapter();

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  const { teamId, accessToken } = await getAccessToken(event);

  const { app, awsLambdaReceiver } = SlackAppAdapter(accessToken);

  app.event(
    "app_home_opened",
    async ({ event: home_event, context: home_context }) => {
      const token = home_context.botToken ?? "";
      const user_id = home_event.user;

      await eventBridge.putEvent(
        "application.slackIntegration",
        {
          accessToken,
          teamId,
          token,
          user_id,
        },
        "app.home.opened"
      );
    }
  );

  const response = await awsLambdaReceiver.start();

  return response(event, context, callback);
};

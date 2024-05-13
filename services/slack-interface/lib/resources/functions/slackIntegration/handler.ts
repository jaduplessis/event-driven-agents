import { APIGatewayProxyHandler } from "aws-lambda";

import {
  EventBridgeAdapter,
  SlackAppAdapter,
} from "@event-driven-agents/adapters";
import {
  MessageEvent,
  RemoveApiKeyEvent,
  SubmitApiKeyEvent,
} from "@event-driven-agents/helpers";
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

  app.action("submit_api_key", async ({ ack, body, context }) => {
    await ack();

    const submitApiKeyEvent: SubmitApiKeyEvent = {
      accessToken,
      teamId,
      token: context.botToken as string,
      user_id: body.user.id,
      body,
    };

    await eventBridge.putEvent(
      "application.slackIntegration",
      {
        ...submitApiKeyEvent,
      },
      "submit.api.key"
    );
  });

  app.action("remove_api_key", async ({ ack, body, context }) => {
    await ack();

    const removeApiKeyEvent: RemoveApiKeyEvent = {
      accessToken,
      teamId,
      token: context.botToken as string,
      user_id: body.user.id,
    };

    await eventBridge.putEvent(
      "application.slackIntegration",
      {
        ...removeApiKeyEvent,
      },
      "remove.api.key"
    );
  });

  app.message(async ({ message, body }) => {
    const messageEvent: MessageEvent = {
      accessToken,
      teamId,
      message,
      user_id: body.user.id,
    };

    await eventBridge.putEvent(
      "application.slackIntegration",
      {
        ...messageEvent,
      },
      "message.received"
    );
  });

  const response = await awsLambdaReceiver.start();

  return response(event, context, callback);
};

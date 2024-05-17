import { APIGatewayProxyHandler } from "aws-lambda";

import {
  EventBridgeAdapter,
  SlackAppAdapter,
} from "@event-driven-agents/adapters";
import {
  AppHomeOpenedEvent,
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
      const user_id = home_event.user;

      const appHomeOpenedEvent: AppHomeOpenedEvent = {
        core: {
          accessToken,
          teamId,
          user_id,
        },
      };

      await eventBridge.putEvent(
        "application.slackIntegration",
        {
          ...appHomeOpenedEvent,
        },
        "app.home.opened"
      );
    }
  );

  app.action("submit_api_key", async ({ ack, body }) => {
    await ack();

    const submitApiKeyEvent: SubmitApiKeyEvent = {
      core: {
        accessToken,
        teamId,
        user_id: body.user.id,
      },
      schema: { body },
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
      core: {
        accessToken,
        teamId,
        user_id: body.user.id,
      },
    };

    await eventBridge.putEvent(
      "application.slackIntegration",
      {
        ...removeApiKeyEvent,
      },
      "remove.api.key"
    );
  });

  app.message(async ({ message }) => {
    let user_id = "";
    if ("user" in message) {
      user_id = message.user as string;
    }

    const messageEvent: MessageEvent = {
      core: {
        accessToken,
        teamId,
        user_id,
      },
      schema: {
        message,
      },
    };

    await eventBridge.putEvent(
      "application.slackIntegration",
      {
        ...messageEvent,
      },
      "receive.message"
    );
  });

  const response = await awsLambdaReceiver.start();

  return response(event, context, callback);
};

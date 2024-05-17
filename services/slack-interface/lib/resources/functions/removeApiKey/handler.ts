import {
  DeleteParameterCommand,
  DeleteParameterCommandInput,
  SSMClient,
} from "@aws-sdk/client-ssm";
import {
  EventBridgeAdapter,
  SlackAppAdapter,
} from "@event-driven-agents/adapters";
import {
  AppHomeOpenedEvent,
  buildResourceName,
  getRegion,
  RemoveApiKeyEvent,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";

const ssm = new SSMClient({ region: getRegion() });
const eventBridge = new EventBridgeAdapter();

export const handler = async (
  event: EventBridgeEvent<"remove.api.key", RemoveApiKeyEvent>
) => {
  const { accessToken, teamId, user_id } = event.detail.core;
  const { app, awsLambdaReceiver } = SlackAppAdapter(accessToken);

  const parameterName = buildResourceName(`api-keys/${teamId}/OPENAI_API_KEY`);

  const input: DeleteParameterCommandInput = {
    Name: `/${parameterName}`,
  };

  const command = new DeleteParameterCommand(input);
  await ssm.send(command);

  await app.client.chat.postMessage({
    token: accessToken,
    channel: user_id,
    text: "API Key deleted successfully!",
  });

  await awsLambdaReceiver.start();

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
};

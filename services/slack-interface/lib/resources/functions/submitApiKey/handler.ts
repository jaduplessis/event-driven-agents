import {
  PutParameterCommand,
  PutParameterCommandInput,
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
  getStateValues,
  SubmitApiKeyEvent,
} from "@event-driven-agents/helpers";
import { EventBridgeEvent } from "aws-lambda";

const ssm = new SSMClient({ region: getRegion() });
const eventBridge = new EventBridgeAdapter();

export const handler = async (
  event: EventBridgeEvent<"submit.api.key", SubmitApiKeyEvent>
) => {
  const { accessToken, teamId, user_id } = event.detail.core;
  const { body } = event.detail.schema;

  const apiKey = getStateValues(body, "api_key_input");

  const { app, awsLambdaReceiver } = SlackAppAdapter(accessToken);

  const parameterName = buildResourceName(`api-keys/${teamId}/OPENAI_API_KEY`);

  const input: PutParameterCommandInput = {
    Name: `/${parameterName}`,
    Value: apiKey,
    Type: "SecureString",
    Overwrite: true,
  };

  const command = new PutParameterCommand(input);
  await ssm.send(command);

  await app.client.chat.postMessage({
    token: accessToken,
    channel: user_id,
    text: "API Key submitted successfully!",
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

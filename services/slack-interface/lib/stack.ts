import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  ApiGateway,
  DynamoDBConstruct,
  EventBridge,
} from "@event-driven-agents/cdk-constructs";
import {
  buildResourceName,
  eventBusName,
  getStage,
} from "@event-driven-agents/helpers";
import {
  AppHome,
  RemoveApiKey,
  SlackAuthCallback,
  SlackInstall,
  SlackIntegration,
  SubmitApiKey,
} from "./resources/functions";

export class SlackInterfaceStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const apiGateway = new ApiGateway(this, "api-gateway", {
      stage,
    });

    const eventBridge = new EventBridge(this, "event-bridge", {
      eventBusName,
    });

    const workspaceTable = new DynamoDBConstruct(this, "workspace-table", {
      tableName: buildResourceName("workspace-table"),
    });

    new SlackIntegration(this, "snack-slack-integration", {
      eventBus: eventBridge.eventBus,
      workspaceTable: workspaceTable.table,
      slackEndPoint: apiGateway.slackEndPoint,
    });

    new SlackInstall(this, "slack-install", {
      slackEndPoint: apiGateway.slackEndPoint,
    });

    new SlackAuthCallback(this, "slack-auth-callback", {
      workspaceTable: workspaceTable.table,
      slackEndPoint: apiGateway.slackEndPoint,
    });

    new AppHome(this, "app-home", {
      eventBus: eventBridge.eventBus,
    });

    new SubmitApiKey(this, "submit-api-key", {
      eventBus: eventBridge.eventBus,
    });

    new RemoveApiKey(this, "remove-api-key", {
      eventBus: eventBridge.eventBus,
    });
  }
}

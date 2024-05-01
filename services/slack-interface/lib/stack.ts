import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ApiGateway, EventBridge } from "@event-driven-agents/cdk-constructs";
import { buildResourceName, getStage } from "@event-driven-agents/helpers";
import { AppHome, SlackIntegration } from "./resources/functions";

export class TranslateStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const eventBridge = new EventBridge(this, "event-bridge", {
      eventBusName: buildResourceName("slackbot-event-bus"),
    });

    const slackIntegration = new SlackIntegration(this, "slack-integration", {
      eventBus: eventBridge.eventBus,
    });

    new ApiGateway(this, "api-gateway", {
      stage,
      slackIntegration,
    });

    new AppHome(this, "app-home", {
      eventBus: eventBridge.eventBus,
    });
  }
}

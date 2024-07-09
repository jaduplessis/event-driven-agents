import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { eventBusName } from "@event-driven-agents/helpers";
import { EventBus } from "aws-cdk-lib/aws-events";
import { RefreshCookies, SendSlackMessage } from "./resources/functions";

export class ToolsStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const eventBus = EventBus.fromEventBusName(
      this,
      "EventBridge",
      eventBusName
    );

    new SendSlackMessage(this, "SendSlackMessage", {
      eventBus,
    });

    new RefreshCookies(this, "RefreshCookies", {
      eventBus,
    });
  }
}

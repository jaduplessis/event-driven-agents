import { EventBus } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

import { buildResourceName } from "@event-driven-agents/helpers";

interface EventBusProps {
  eventBusName: string;
}

export class EventBridge extends Construct {
  public eventBus: EventBus;

  constructor(scope: Construct, id: string, { eventBusName }: EventBusProps) {
    super(scope, id);

    this.eventBus = new EventBus(this, buildResourceName("event-bus"), {
      eventBusName,
    });
  }
}

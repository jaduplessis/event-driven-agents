import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { DynamoDBConstruct } from "@event-driven-agents/cdk-constructs";
import { buildResourceName, eventBusName } from "@event-driven-agents/helpers";
import { EventBus } from "aws-cdk-lib/aws-events";
import {
  Plan,
  QueryTesco,
  Replan,
  SendSlackMessage,
} from "./resources/functions";

export class AgentStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const agentTable = new DynamoDBConstruct(this, "agentTable", {
      tableName: buildResourceName("agent-table"),
    });

    const eventBus = EventBus.fromEventBusName(
      this,
      "EventBridge",
      eventBusName
    );

    new Plan(this, "plan", {
      eventBus,
      agentTable: agentTable.table,
    });

    new Replan(this, "replan", {
      eventBus,
      agentTable: agentTable.table,
    });

    new QueryTesco(this, "queryTesco", {
      eventBus,
      agentTable: agentTable.table,
    });

    new SendSlackMessage(this, "sendSlackMessage", {
      eventBus,
    });
  }
}

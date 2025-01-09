import {
  DynamoDBConstruct,
  HttpApiGateway,
} from "@event-driven-agents/cdk-constructs";
import {
  buildResourceName,
  eventBusName,
  getStage,
} from "@event-driven-agents/helpers";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { EventBus } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import {
  Plan,
  QueryTesco,
  Replan,
  SendSlackMessage,
  SetTescoToken,
  UpdateBasketDynamo,
  UpdateBasketTesco,
} from "./resources/functions";

export class AgentStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const agentTable = new DynamoDBConstruct(this, "agentTable", {
      tableName: buildResourceName("agent-table"),
    });

    const apiGateway = new HttpApiGateway(
      this,
      buildResourceName("api-gateway-v2"),
      {
        stage,
      }
    );

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

    new UpdateBasketTesco(this, "updateBasketTesco", {
      eventBus,
      agentTable: agentTable.table,
    });

    new UpdateBasketDynamo(this, "updateBasketDynamo", {
      eventBus,
      agentTable: agentTable.table,
    });

    new SendSlackMessage(this, "sendSlackMessage", {
      eventBus,
    });

    new SetTescoToken(this, "setTescoToken", {
      apiGateway,
    });

    new CfnOutput(this, "apiGatewayUrl", {
      description: "API Gateway URL",
      value: apiGateway.httpApi.url ?? "",
    });
  }
}

import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { SlackCustomResource } from "@event-driven-agents/cdk-constructs";
import {
  buildParameterArnSsm,
  buildResourceName,
  getCdkHandlerPath,
  getEnvVariable,
  getRegion,
} from "@event-driven-agents/helpers";
import { Duration, Stack } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IEventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface FunctionProps {
  eventBus: IEventBus;
  agentTable: Table;
}

export class Replan extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { eventBus, agentTable }: FunctionProps
  ) {
    super(scope, id);

    const region = getRegion();
    const accountId = Stack.of(this).account;

    const SLACK_SIGNING_SECRET = getEnvVariable("SLACK_SIGNING_SECRET");

    this.function = new SlackCustomResource(this, buildResourceName("replan"), {
      lambdaEntry: getCdkHandlerPath(__dirname),
      timeout: Duration.minutes(3),
      environment: {
        SLACK_SIGNING_SECRET,
        EVENT_BUS: eventBus.eventBusName,
      },
    });

    eventBus.grantPutEventsTo(this.function);
    agentTable.grantReadWriteData(this.function);

    new Rule(this, buildResourceName("on-message-received-event"), {
      eventBus,
      eventPattern: {
        source: ["plan.end"],
        detailType: ["agent.replan"],
      },
      targets: [new LambdaFunction(this.function)],
    });

    const apiAccessPattern = buildResourceName("api-keys/*");

    const ssmReadPolicy = new PolicyStatement({
      actions: ["ssm:GetParameter"],
      resources: [
        buildParameterArnSsm(`${apiAccessPattern}`, region, accountId),
      ],
    });
    this.function.addToRolePolicy(ssmReadPolicy);
  }
}

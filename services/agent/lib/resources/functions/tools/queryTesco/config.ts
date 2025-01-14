import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { SlackCustomResource } from "@event-driven-agents/cdk-constructs";
import {
  buildResourceName,
  getCdkHandlerPath,
  getEnvVariable,
} from "@event-driven-agents/helpers";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IEventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import { Tools } from "../../../dataModel";

interface FunctionProps {
  eventBus: IEventBus;
  agentTable: Table;
}

export class QueryTesco extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { eventBus, agentTable }: FunctionProps
  ) {
    super(scope, id);

    this.function = new SlackCustomResource(
      this,
      buildResourceName("query-tesco"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
        environment: {
          EVENT_BUS: eventBus.eventBusName,
          TESCO_API_KEY: getEnvVariable("TESCO_API_KEY"),
        },
      }
    );

    eventBus.grantPutEventsTo(this.function);
    agentTable.grantReadWriteData(this.function);

    new Rule(this, buildResourceName("on-query-tesco-event"), {
      eventBus,
      eventPattern: {
        source: ["agent.brain", "tools"],
        detailType: [
          `tools.${Tools.queryTesco}`,
          `tools.functions.${Tools.queryTesco}`,
        ],
      },
      targets: [new LambdaFunction(this.function)],
    });
  }
}

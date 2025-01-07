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

export class UpdateBasketTesco extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { eventBus, agentTable }: FunctionProps
  ) {
    super(scope, id);

    this.function = new SlackCustomResource(
      this,
      buildResourceName("update-basket-tesco"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
        environment: {
          EVENT_BUS: eventBus.eventBusName,
          TESCO_API_KEY: getEnvVariable("TESCO_API_KEY"),
          TESCO_BEARER_TOKEN: getEnvVariable("TESCO_BEARER_TOKEN"),
        },
      }
    );

    eventBus.grantPutEventsTo(this.function);
    agentTable.grantReadWriteData(this.function);

    new Rule(this, buildResourceName("on-update-basket-tesco-event"), {
      eventBus,
      eventPattern: {
        source: ["agent.brain"],
        detailType: [
          `tools.${Tools.updateBasketTesco}`,
          `tools.functions.${Tools.updateBasketTesco}`,
        ],
      },
      targets: [new LambdaFunction(this.function)],
    });
  }
}

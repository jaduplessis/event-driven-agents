import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { SlackCustomResource } from "@event-driven-agents/cdk-constructs";
import {
  buildResourceName,
  getCdkHandlerPath,
} from "@event-driven-agents/helpers";
import { Duration } from "aws-cdk-lib";
import { IEventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";

interface RefreshCookiesProps {
  eventBus: IEventBus;
}

export class RefreshCookies extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, { eventBus }: RefreshCookiesProps) {
    super(scope, id);

    this.function = new SlackCustomResource(
      this,
      buildResourceName("refresh-cookie"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
      }
    );

    new Rule(this, buildResourceName("on-refresh-cookie-event"), {
      eventBus,
      eventPattern: {
        source: ["*"],
        detailType: ["refresh.cookie"],
      },
      targets: [new LambdaFunction(this.function)],
    });
  }
}

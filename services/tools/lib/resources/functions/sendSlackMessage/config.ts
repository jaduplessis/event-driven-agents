import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { SlackCustomResource } from "@event-driven-agents/cdk-constructs";
import {
  buildResourceName,
  getCdkHandlerPath,
  getEnvVariable,
} from "@event-driven-agents/helpers";
import { Duration } from "aws-cdk-lib";
import { IEventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";

interface SendSlackMessageProps {
  eventBus: IEventBus;
}

export class SendSlackMessage extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { eventBus }: SendSlackMessageProps
  ) {
    super(scope, id);

    const SLACK_SIGNING_SECRET = getEnvVariable("SLACK_SIGNING_SECRET");

    this.function = new SlackCustomResource(
      this,
      buildResourceName("send-slack-message"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
        environment: {
          SLACK_SIGNING_SECRET,
        },
      }
    );

    new Rule(this, buildResourceName("on-send-slack-message-event"), {
      eventBus,
      eventPattern: {
        source: ["agent.brain"],
        detailType: ["slack.send.message"],
      },
      targets: [new LambdaFunction(this.function)],
    });
  }
}

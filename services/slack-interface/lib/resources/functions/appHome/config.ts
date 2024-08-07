import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { SlackCustomResource } from "@event-driven-agents/cdk-constructs";
import {
  buildParameterArnSsm,
  buildResourceName,
  getCdkHandlerPath,
  getEnvVariable,
  getRegion,
} from "@event-driven-agents/helpers";
import { Stack } from "aws-cdk-lib";
import { IEventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface appHomeProps {
  eventBus: IEventBus;
}

export class AppHome extends Construct {
  public function: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { eventBus }: appHomeProps
  ) {
    super(scope, id);

    const region = getRegion();
    const accountId = Stack.of(this).account;

    const SLACK_SIGNING_SECRET = getEnvVariable("SLACK_SIGNING_SECRET");

    this.function = new SlackCustomResource(
      this,
      buildResourceName("app-home-opened"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        environment: {
          SLACK_SIGNING_SECRET,
        },
      }
    );

    new Rule(this, buildResourceName("on-app-home-opened-event"), {
      eventBus,
      eventPattern: {
        source: ["application.slackIntegration"],
        detailType: ["app.home.opened"],
      },
      targets: [new LambdaFunction(this.function)],
    });

    const accessPatternApiKey = buildResourceName("api-keys/*");
    const ssmReadPolicy = new PolicyStatement({
      actions: ["ssm:GetParameter"],
      resources: [
        buildParameterArnSsm(`${accessPatternApiKey}`, region, accountId),
      ],
    });
    this.function.addToRolePolicy(ssmReadPolicy);
  }
}

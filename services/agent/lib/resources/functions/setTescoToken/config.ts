import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import {
  HttpApiGateway,
  SlackCustomResource,
} from "@event-driven-agents/cdk-constructs";
import {
  buildParameterArnSsm,
  buildResourceName,
  getCdkHandlerPath,
  getRegion,
} from "@event-driven-agents/helpers";
import { Stack } from "aws-cdk-lib";
import { HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface FunctionProps {
  apiGateway: HttpApiGateway;
}

export class SetTescoToken extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, { apiGateway }: FunctionProps) {
    super(scope, id);

    const region = getRegion();
    const accountId = Stack.of(this).account;

    this.function = new SlackCustomResource(
      this,
      buildResourceName("set-tesco-token"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
      }
    );

    apiGateway.httpApi.addRoutes({
      path: "/set-tesco-token",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "set-tesco-token-integration",
        this.function
      ),
    });

    const accessPattern = buildResourceName("tesco-bearer-token");
    const ssmReadPolicy = new PolicyStatement({
      actions: ["ssm:PutParameter"],
      resources: [buildParameterArnSsm(accessPattern, region, accountId)],
    });

    this.function.addToRolePolicy(ssmReadPolicy);
  }
}

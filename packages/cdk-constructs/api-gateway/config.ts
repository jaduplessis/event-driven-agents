import { buildResourceName } from "@event-driven-agents/helpers";
import {
  ApiKeySourceType,
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { CorsHttpMethod, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export interface ApiGatewayProps {
  stage: string;
}

export class ApiGateway extends Construct {
  public restApi: RestApi;
  public slackEndPoint: Resource;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const { stage } = props;

    this.restApi = new RestApi(this, "api-gateway", {
      restApiName: buildResourceName("api-gateway"),
      deployOptions: {
        stageName: stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["*"],
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    this.slackEndPoint = this.restApi.root.addResource("slack");

    const parameterName = buildResourceName("system/api-gateway-url");

    // Create SSM parameter for the API Gateway URL
    new StringParameter(this, "api-gateway-url", {
      parameterName: `/${parameterName}`,
      stringValue: this.restApi.url,
    });
  }
}

export class HttpApiGateway extends Construct {
  public httpApi: HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const { stage } = props;

    this.httpApi = new HttpApi(this, "api-gateway-v2", {
      apiName: buildResourceName(`${stage}-api-gateway-v2`),
      createDefaultStage: true,
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: ["*"],
      },
    });

    // Create SSM parameter for the API Gateway URL
    new StringParameter(this, "api-gateway-v2-url", {
      parameterName: `/system/${buildResourceName("api-gateway-v2-url")}`,
      stringValue: this.httpApi.url ?? "",
    });
  }
}

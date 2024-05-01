import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ApiGatewayProps } from "./types";

interface CreateIntegrationsProps extends ApiGatewayProps {
  api: RestApi;
}

export const createIntegrations = (props: CreateIntegrationsProps) => {
  const { api, slackIntegration } = props;

  const slackEndPoint = api.root.addResource("slack");

  const eventsIntegrationEndPoint = slackEndPoint.addResource("events");
  const eventsIntegration = new LambdaIntegration(slackIntegration.function);
  eventsIntegrationEndPoint.addMethod("POST", eventsIntegration);
};

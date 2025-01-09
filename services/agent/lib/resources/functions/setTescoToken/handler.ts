import { SSMClient } from "@aws-sdk/client-ssm";
import {
  buildResourceName,
  getRegion,
  uploadParameter,
} from "@event-driven-agents/helpers";
import { APIGatewayProxyHandler } from "aws-lambda";

const SSM = new SSMClient({ region: getRegion() });

interface Headers {
  name: string;
  value: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const headers: Headers[] = body.headers || [];

  // Find authorization header
  const authorization = headers.find(
    (header) => header.name.toLowerCase() === "authorization"
  );

  if (!authorization) {
    return {
      statusCode: 204,
      body: JSON.stringify({ message: "Bearer token not found" }),
    };
  }

  const bearerToken = authorization.value;

  console.log("Bearer token:", bearerToken);

  const parameterName = buildResourceName(`tesco-bearer-token`);

  await uploadParameter(SSM, parameterName, bearerToken, true);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Bearer token set" }),
  };
};

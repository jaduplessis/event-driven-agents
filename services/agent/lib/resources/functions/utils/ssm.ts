import { SSMClient } from "@aws-sdk/client-ssm";
import { getParameter } from "@event-driven-agents/helpers";

export const loadSsmValues = async (
  ssm: SSMClient,
  teamId: string
): Promise<void> => {
  const apiKey = await getParameter(
    ssm,
    `api-keys/${teamId}/OPENAI_API_KEY`,
    true
  );
  if (apiKey === undefined) {
    throw new Error("Unable to load SSM values");
  }

  process.env.OPENAI_API_KEY = apiKey;
};

import { getEnvVariable } from "@event-driven-agents/helpers";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources";
import { ToolsList, toolsListSchema } from "../../dataModel";
import { parseArguments } from "./parseArguments";

interface InvokeParams {
  systemPrompt: string;
  tools: ChatCompletionTool[];
}

const MAX_ATTEMPTS = 3;

export const evaluatePlan = async ({
  systemPrompt,
  tools,
}: InvokeParams): Promise<ToolsList> => {
  const openai = new OpenAI({
    apiKey: getEnvVariable("OPENAI_API_KEY"),
  });

  let attempts = 0;
  let response;

  do {
    try {
      response = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
        ],
        tools,
      });
    } catch (error) {
      console.error("Error occurred while evaluating plan", error);
    } finally {
      attempts++;
    }
  } while (attempts < MAX_ATTEMPTS);

  if (!response) {
    throw new Error("Failed to evaluate plan");
  }

  const message = response.choices[0].message;
  const finish_reason = response.choices[0].finish_reason;

  let data = {};
  if (message.content) {
    data = JSON.parse(message.content as string);
  } else if (message.tool_calls) {
    data = parseArguments(message.tool_calls);
  }

  const parsedResponse = toolsListSchema.parse(data);

  return parsedResponse;
};

import {
  getEnvVariable,
  ToolsList,
  toolsListSchema,
} from "@event-driven-agents/helpers";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources";
import { parseArguments } from "./parseArguments";

interface InvokeParams {
  systemPrompt: string;
  tools: ChatCompletionTool[];
}

export const evaluatePlan = async ({
  systemPrompt,
  tools,
}: InvokeParams): Promise<ToolsList> => {
  const openai = new OpenAI({
    apiKey: getEnvVariable("OPENAI_API_KEY"),
  });

  console.log("systemPrompt", systemPrompt);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
    ],
    tools,
  });

  console.log(JSON.stringify(response, null, 2));

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

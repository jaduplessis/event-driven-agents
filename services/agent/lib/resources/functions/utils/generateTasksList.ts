import {
  getEnvVariable,
  ToolsList,
  toolsListSchema,
} from "@event-driven-agents/helpers";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources";
import { parseArguments } from "./parseArguments";

interface ModelConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface InvokeParams {
  systemPrompt: string;
  humanPrompt: string;
  tools: ChatCompletionTool[];
}

export const generateTasksList = async ({
  systemPrompt,
  humanPrompt,
  tools,
}: InvokeParams): Promise<ToolsList> => {
  const openai = new OpenAI({
    apiKey: getEnvVariable("OPENAI_API_KEY"),
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: humanPrompt,
      },
    ],
    tools,
  });

  console.log(JSON.stringify(response, null, 2));

  const message = response.choices[0].message;

  let data = {};
  if (message.content) {
    data = JSON.parse(response.choices[0].message.content as string);
  } else if (message.tool_calls) {
    data = parseArguments(message.tool_calls);
  }

  const parsedResponse = toolsListSchema.parse(data);

  return parsedResponse;
};

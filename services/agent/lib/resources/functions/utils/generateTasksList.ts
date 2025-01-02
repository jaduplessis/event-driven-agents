import {
  getEnvVariable,
  ToolsList,
  toolsListSchema,
} from "@event-driven-agents/helpers";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

interface ModelConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface InvokeParams {
  systemPrompt: string;
  humanPrompt: string;
}

const openai = new OpenAI({
  apiKey: getEnvVariable("OPENAI_API_KEY"),
});

export const generateTasksList = async ({
  systemPrompt,
  humanPrompt,
}: InvokeParams): Promise<ToolsList> => {
  const response = await openai.beta.chat.completions.parse({
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
    response_format: zodResponseFormat(toolsListSchema, "tools_list"),
  });

  const parsedResponse = response.choices[0].message.parsed;

  if (!parsedResponse) {
    throw new Error("Failed to parse response");
  }

  return parsedResponse;
};

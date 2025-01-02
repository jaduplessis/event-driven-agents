import { getEnvVariable } from "@event-driven-agents/helpers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

interface ModelConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface InvokeParams {
  systemPrompt: string;
  humanPrompt: string;
  modelConfig: ModelConfig;
}

const oai = new OpenAI({
  apiKey: getEnvVariable("OPENAI_API_KEY"),
});

export const invoke = async ({
  systemPrompt,
  humanPrompt,
  modelConfig,
}: InvokeParams): Promise<string> => {
  const model = new ChatOpenAI({
    ...modelConfig,
  });

  const messages: (HumanMessage | SystemMessage)[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  const response = await model.invoke(messages);
  const stringResponse = response.content as string;

  return stringResponse;
};

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

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

import { getEnvVariable } from "@event-driven-agents/helpers";
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { ToolsList, toolsListSchema } from "../../dataModel";
import { parseArguments } from "./parseArguments";

interface InvokeParams {
  messages: ChatCompletionMessageParam[];
  tools: ChatCompletionTool[];
}

export const generateTasksList = async ({
  messages,
  tools,
}: InvokeParams): Promise<ToolsList> => {
  const openai = new OpenAI({
    apiKey: getEnvVariable("OPENAI_API_KEY"),
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages,
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

import { ChatCompletionTool } from "openai/resources";
import { z } from "zod";
import { toolRequestSchema, Tools } from "./schemas";

export const sendMessageDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: Tools.sendMessage,
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The message to send",
        },
      },
      required: ["message"],
    },
  },
};

export const sendMessageSchema = toolRequestSchema.extend({
  function: toolRequestSchema.shape.function.extend({
    arguments: z.object({
      message: z.string(),
    }),
  }),
});
export type SendMessageRequest = z.infer<typeof sendMessageSchema>;

export const googleSearchDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: Tools.googleSearch,
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        k: {
          type: "number",
          description: "The number of results to return. Default is 1",
        },
      },
      required: ["query", "k"],
    },
  },
};

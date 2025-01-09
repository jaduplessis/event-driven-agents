import { ChatCompletionTool } from "openai/resources/chat/completions";

import { z } from "zod";

export const sendMessageDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "sendMessage",
    description: "Send a message to the user",
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

export const sendMessageSchema = z.object({
  message: z.string(),
});

export type SendMessageRequest = z.infer<typeof sendMessageSchema>;

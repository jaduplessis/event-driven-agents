import { ChatCompletionTool } from "openai/resources";

import { z } from "zod";
import { Tools } from "../schemas";

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

export const sendMessageSchema = z.object({
  message: z.string(),
});

export type SendMessageRequest = z.infer<typeof sendMessageSchema>;

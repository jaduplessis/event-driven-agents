import { ChatCompletionTool } from "openai/resources/chat/completions";

import { z } from "zod";

export const queryTescoDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "queryTesco",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The item to search for at Tesco",
        },
      },
      required: ["query"],
    },
  },
};

export const queryTescoSchema = z.object({
  query: z.string(),
});

export type QueryTescoRequest = z.infer<typeof queryTescoSchema>;

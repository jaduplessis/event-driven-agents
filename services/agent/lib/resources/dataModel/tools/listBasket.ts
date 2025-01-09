import { ChatCompletionTool } from "openai/resources/chat/completions";

import { z } from "zod";

export const listBasketDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "listBasket",
    description:
      "List all the items in this weeks basket. Can specify by user contribution or by entire basket",
    parameters: {
      type: "object",
      properties: {
        user: {
          type: "string",
          description:
            "The user id requesting the basket item. If not provided, will return the entire basket",
        },
      },
      required: [],
    },
  },
};

export const listBasketSchema = z.object({
  user: z.string().optional(),
});

export type ListBasketRequest = z.infer<typeof listBasketSchema>;

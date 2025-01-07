import { ChatCompletionTool } from "openai/resources/chat/completions";

import { z } from "zod";

export const updateBasketTescoDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "updateBasketTesco",
    description:
      "Specifies the quantity of a specific item in the Tesco basket",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The node id of a specific grocery item at Tesco",
        },
        quantity: {
          type: "number",
          description: "The quantity of the item to be included in the basket",
          default: 1,
        },
      },
      required: ["id"],
    },
  },
};

export const updateBasketTescoSchema = z.object({
  id: z.string(),
  quantity: z.number().default(1),
});

export type UpdateBasketTescoRequest = z.infer<typeof updateBasketTescoSchema>;

import { ChatCompletionTool } from "openai/resources/chat/completions";

import { z } from "zod";

export const updateBasketDynamoDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "updateBasketDynamo",
    description:
      "Specifies the quantity and unit price of a specific item for delivery. Items get stored in the basket until the order is placed",
    parameters: {
      type: "object",
      properties: {
        user: {
          type: "string",
          description: "The user id requesting the basket item",
        },
        id: {
          type: "string",
          description: "The node id of a specific grocery item at Tesco",
        },
        title: {
          type: "string",
          description: "The title of the item",
        },
        quantity: {
          type: "number",
          description: "The quantity of the item",
          default: 1,
        },
        unitPrice: {
          type: "number",
          description: "The unit price of the item",
        },
      },
      required: ["user", "id", "title", "quantity", "unitPrice"],
    },
  },
};

export const updateBasketDynamoSchema = z.object({
  user: z.string(),
  id: z.string(),
  quantity: z.number().default(1),
  unitPrice: z.number(),
  title: z.string(),
});

export type UpdateBasketDynamoRequest = z.infer<
  typeof updateBasketDynamoSchema
>;

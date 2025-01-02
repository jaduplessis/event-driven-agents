import { z } from "zod";

/*
Tool schemas are divided into 3 sets:
1. ToolDefinition: 
This is the definition of the tool that is provided to the LLM. It is a JSON object that provides the 
necessary information for the LLM to use the tool and know when to use it

2. ToolRequest:
This is the request object that is sent to the tool. It is a JSON object that the LLM creates in order to
send to the tool.

3. ToolEvent:
This is the event object that is sent to the tool. It is based off of the ToolRequest object, but it is
extended to contain additional information that the tool may need to know about the event.
*/

export const toolsEnumSchema = z.enum(["sendMessage", "googleSearch"]);
export type ToolsEnum = z.infer<typeof toolsEnumSchema>;
export const Tools = toolsEnumSchema.Values;

// {
//     "name": "get_delivery_date",
//     "description": "Get the delivery date for a customer's order. Call this whenever you need to know the delivery date, for example when a customer asks 'Where is my package'",
//     "parameters": {
//         "type": "object",
//         "properties": {
//             "order_id": {
//                 "type": "string",
//                 "description": "The customer's order ID."
//             }
//         },
//         "required": ["order_id"],
//         "additionalProperties": false
//     }
// }

const toolParameterEnum = z.enum(["string", "number", "boolean", "object"]);
export type ToolParameterEnum = z.infer<typeof toolParameterEnum>;

export const toolPropertiesSchema = z.record(
  z.object({
    type: toolParameterEnum,
    description: z.string(),
  })
);

export const toolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.object({
    properties: toolPropertiesSchema,
    required: z.array(z.string()),
  }),
  output: z
    .object({
      properties: toolPropertiesSchema,
    })
    .nullable(),
});
export type ToolDefinition = z.infer<typeof toolDefinitionSchema>;

export const toolRequestSchema = z.object({
  actionId: z.string(),
  function: z.object({
    name: toolsEnumSchema,
    arguments: z.array(z.string()),
  }),
});
export type ToolRequest = z.infer<typeof toolRequestSchema>;

export const toolsListSchema = z.object({
  steps: z.array(toolRequestSchema),
});

export type ToolsList = z.infer<typeof toolsListSchema>;

export const baseEventSchema = z.object({
  core: z.object({
    accessToken: z.string(),
    user_id: z.string(),
    teamId: z.string(),
    channel: z.string().optional(),
  }),
});
export type BaseEvent = z.infer<typeof baseEventSchema>;

export const toolEventSchema = baseEventSchema.extend({
  currentTool: toolRequestSchema,
  followingTools: z.array(toolRequestSchema),
});
export type ToolEvent = z.infer<typeof toolEventSchema>;

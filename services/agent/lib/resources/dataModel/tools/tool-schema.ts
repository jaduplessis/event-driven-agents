import { agentEventSchema } from "@event-driven-agents/helpers";
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

export const toolsEnumSchema = z.enum([
  "sendMessage",
  "queryTesco",
  "updateBasketTesco",
]);

export type ToolsEnum = z.infer<typeof toolsEnumSchema>;
export const Tools = toolsEnumSchema.Values;

export const toolRequestSchema = z.object({
  id: z.string(),
  function: z.object({
    name: z.string(),
    arguments: z.record(z.any()),
  }),
});
export type ToolRequest = z.infer<typeof toolRequestSchema>;

export const toolsListSchema = z.array(toolRequestSchema);
export type ToolsList = z.infer<typeof toolsListSchema>;

export const toolEventSchema = agentEventSchema.extend({
  toolDetails: z.object({
    planResults: z.array(z.string()),
    previousTools: z.array(toolRequestSchema),
    currentTool: toolRequestSchema,
    followingTools: z.array(toolRequestSchema),
  }),
});
export type ToolEvent = z.infer<typeof toolEventSchema>;

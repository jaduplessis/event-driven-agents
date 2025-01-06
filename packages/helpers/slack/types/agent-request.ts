import { z } from "zod";
import { baseEventSchema } from ".";

const MAXIMUM_STEPS = 5;

export const agentEventSchema = baseEventSchema.extend({
  processingStep: z.number().int().min(0).max(MAXIMUM_STEPS),
  message: z.string(),
});
export type AgentEvent = z.infer<typeof agentEventSchema>;

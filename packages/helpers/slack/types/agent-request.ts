import { z } from "zod";
import { baseEventSchema } from "./event-types";

const MAXIMUM_STEPS = 5;

export const agentEventSchema = baseEventSchema.extend({
  processingStep: z.number().int().min(0).max(MAXIMUM_STEPS).default(0),
  message: z.string().optional(),
  thread_ts: z.string(),
});
export type AgentEvent = z.infer<typeof agentEventSchema>;

import { KnownEventFromType, SlackAction } from "@slack/bolt";
import { z } from "zod";

export interface SubmitApiKeyEvent extends BaseEvent {
  schema: {
    body: SlackAction;
  };
}

export const baseEventSchema = z.object({
  core: z.object({
    accessToken: z.string(),
    user_id: z.string(),
    teamId: z.string(),
    channel: z.string().optional(),
    ts: z.string().optional(),
  }),
});
export type BaseEvent = z.infer<typeof baseEventSchema>;

export interface RemoveApiKeyEvent extends BaseEvent {}

export interface AppHomeOpenedEvent extends BaseEvent {}

type MessageDetailsBase = KnownEventFromType<"message">;

interface MessageDetailsExtension {
  text?: string;
  thread_ts?: string;
}

export interface MessageEvent extends BaseEvent {
  schema: {
    message: MessageDetailsBase & MessageDetailsExtension;
  };
}

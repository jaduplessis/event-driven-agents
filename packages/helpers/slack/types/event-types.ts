import { KnownEventFromType } from "@slack/bolt";
import { BaseEvent } from "../../agent";
import { SlackInteractionPayload } from "./interaction-payload";

export interface SubmitApiKeyEvent extends BaseEvent {
  body: SlackInteractionPayload;
}

export interface AppHomeOpenedEvent extends BaseEvent {
  token: string;
  user_id: string;
}

type MessageDetailsBase = KnownEventFromType<"message">;

interface MessageDetailsExtension {
  text?: string;
  thread_ts?: string;
}

export interface MessageEvent extends BaseEvent {
  message: MessageDetailsBase & MessageDetailsExtension;
}

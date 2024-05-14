import { KnownEventFromType, SlackAction } from "@slack/bolt";
import { BaseEvent } from "../../agent";
import { SlackInteractionPayload } from "./interaction-payload";

export interface SubmitApiKeyEvent extends BaseEvent {
  body: SlackAction;
  token: string;
}

export interface RemoveApiKeyEvent extends BaseEvent {
  token: string;
}

export interface AppHomeOpenedEvent extends BaseEvent {
  token: string;
}

type MessageDetailsBase = KnownEventFromType<"message">;

interface MessageDetailsExtension {
  text?: string;
  thread_ts?: string;
}

export interface MessageEvent extends BaseEvent {
  message: MessageDetailsBase & MessageDetailsExtension;
}

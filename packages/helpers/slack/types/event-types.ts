import { KnownEventFromType, SlackAction } from "@slack/bolt";
import { BaseEvent } from "../../agent";

export interface SubmitApiKeyEvent extends BaseEvent {
  schema: {
    body: SlackAction;
  };
}

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

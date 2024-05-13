import { BaseEvent } from './baseEvent'

export interface SendSlackMessageEvent extends BaseEvent {
  channel: string;
  message: string;
}

export interface QueryTescoEvent extends BaseEvent {
  // Fill in...
}
import type { InputItem, TransformedItem, ValidItem } from "dynamodb-toolbox";
import {
  Entity,
  GetItemCommand,
  schema,
  string,
  UpdateItemCommand,
} from "dynamodb-toolbox";
import { AgentTable } from "./Table";

export const messageSchema = schema({
  ts: string().key(),
  teamId: string(),
  thread_ts: string().optional(),
  channel: string(),
  text: string(),
});

export const MessageEntity = new Entity({
  name: "MessageItem",
  table: AgentTable,
  schema: messageSchema,
  computeKey: ({ ts }) => ({
    PK: `MESSAGE_TS#${ts}`,
    SK: "ROOT",
  }),
});

export type MessageTypeInput = InputItem<typeof MessageEntity>;
export type MessageTypeValid = ValidItem<typeof MessageEntity>;
export type MessageTypeTransformed = TransformedItem<typeof MessageEntity>;

export const getMessage = async (ts: string): Promise<MessageTypeInput> => {
  const { Item } = await MessageEntity.build(GetItemCommand).key({ ts }).send();

  if (!Item) {
    throw new Error("Message not found");
  }
  return Item;
};

export const createMessage = async (
  message: MessageTypeInput
): Promise<MessageTypeInput> => {
  const { Attributes } = await MessageEntity.build(UpdateItemCommand)
    .item(message)
    .options({ returnValues: "ALL_NEW" })
    .send();

  if (!Attributes) {
    throw new Error("Failed to create or update message");
  }

  return Attributes;
};

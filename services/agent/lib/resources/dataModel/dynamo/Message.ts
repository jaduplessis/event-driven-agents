import type { InputItem, TransformedItem, ValidItem } from "dynamodb-toolbox";
import {
  Entity,
  GetItemCommand,
  QueryCommand,
  schema,
  string,
  UpdateItemCommand,
} from "dynamodb-toolbox";
import { AgentTable } from "./Table";

export const messageSchema = schema({
  thread_ts: string().key(),
  message_ts: string().key().default("ROOT"),
  user: string(),
  channel: string(),
  text: string(),
});

export const MessageEntity = new Entity({
  name: "MessageItem",
  table: AgentTable,
  schema: messageSchema,
  computeKey: ({ thread_ts, message_ts }) => ({
    PK: `THREAD#${thread_ts}`,
    SK: `MESSAGE#${message_ts}`,
  }),
});

export type MessageTypeInput = InputItem<typeof MessageEntity>;
export type MessageTypeValid = ValidItem<typeof MessageEntity>;
export type MessageTypeTransformed = TransformedItem<typeof MessageEntity>;

interface RawMessageKeys {
  thread_ts: string | undefined;
  message_ts: string;
}

const buildKeys = (messageKeys: RawMessageKeys) => {
  const { thread_ts, message_ts } = messageKeys;
  if (thread_ts === undefined) {
    return {
      thread_ts: message_ts,
      message_ts: "ROOT",
    };
  }
  return { thread_ts, message_ts };
};

export const getMessage = async (
  messageKeys: RawMessageKeys
): Promise<MessageTypeInput> => {
  const { thread_ts, message_ts } = buildKeys(messageKeys);

  const { Item } = await MessageEntity.build(GetItemCommand)
    .key({ thread_ts, message_ts })
    .send();

  if (!Item) {
    throw new Error("Message not found");
  }
  return Item;
};

interface CreateMessageProps {
  messageKeys: RawMessageKeys;
  message: {
    teamId: string;
    user: string;
    channel: string;
    text: string;
  };
}

export const createMessage = async ({
  messageKeys,
  message,
}: CreateMessageProps): Promise<MessageTypeInput> => {
  const { thread_ts, message_ts } = buildKeys(messageKeys);

  const { Attributes } = await MessageEntity.build(UpdateItemCommand)
    .item({
      ...message,
      thread_ts,
      message_ts,
    })
    .options({ returnValues: "ALL_NEW" })
    .send();

  if (!Attributes) {
    throw new Error("Failed to create or update message");
  }

  return Attributes;
};

export const getThreadMessages = async (
  thread_ts: string
): Promise<MessageTypeInput[]> => {
  const query = {
    partition: `THREAD#${thread_ts}`,
  };

  const { Items } = await AgentTable.build(QueryCommand)
    .query(query)
    .entities(MessageEntity)
    .send();

  if (!Items) {
    throw new Error("No messages found");
  }

  return Items.map((item) => ({
    ...item,
    entity: "MessageItem",
  }));
};

import type {
  InputItem,
  Query,
  TransformedItem,
  ValidItem,
} from "dynamodb-toolbox";
import {
  Entity,
  GetItemCommand,
  QueryCommand,
  schema,
  string,
  UpdateItemCommand,
} from "dynamodb-toolbox";
import { ulid } from "ulid";
import { AgentTable } from "./Table";

const toolSchema = schema({
  thread_ts: string().key(),
  type: string().key(),
  toolId: string().key(),
  properties: string(),
  results: string(),
});

export const ToolEntity = new Entity({
  name: "ToolItem",
  table: AgentTable,
  schema: toolSchema,
  computeKey: ({ thread_ts, type, toolId }) => ({
    PK: `THREAD#${thread_ts}`,
    SK: `TOOL#${type}#${toolId}`,
  }),
});

export type ToolTypeInput = InputItem<typeof ToolEntity>;
export type ToolTypeValid = ValidItem<typeof ToolEntity>;
export type ToolTypeTransformed = TransformedItem<typeof ToolEntity>;

export const getToolUse = async (
  thread_ts: string,
  type: string,
  toolId: string
): Promise<ToolTypeInput> => {
  const params = ToolEntity.build(GetItemCommand).key({
    thread_ts,
    type,
    toolId,
  });

  const { Item } = await params.send();

  if (!Item) {
    throw new Error("Tool use not found");
  }
  return Item;
};

export type CreateToolRequest = Omit<InputItem<typeof ToolEntity>, "toolId">;

export const createToolUse = async (
  toolItem: CreateToolRequest
): Promise<ToolTypeInput> => {
  const toolId = ulid();

  const params = ToolEntity.build(UpdateItemCommand)
    .item({ ...toolItem, toolId })
    .options({ returnValues: "ALL_NEW" });

  const { Attributes } = await params.send();

  if (!Attributes) {
    throw new Error("Failed to create or update message");
  }

  return Attributes;
};

export const getThreadToolUse = async (
  thread_ts: string
): Promise<ToolTypeInput[]> => {
  const query: Query<typeof AgentTable> = {
    partition: `THREAD#${thread_ts}`,
  };

  const { Items } = await AgentTable.build(QueryCommand)
    .query(query)
    .entities(ToolEntity)
    .send();

  if (!Items) {
    throw new Error("No tools found");
  }

  return Items.map((item) => ({
    ...item,
    entity: "ToolItem",
  }));
};

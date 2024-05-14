import { Entity, EntityItem } from "dynamodb-toolbox";

import { AgentTable } from "./Table";

export const MessageEntity = new Entity({
  name: "MessageItem",
  attributes: {
    PK: { partitionKey: true, hidden: true, prefix: "MESSAGE_TS#" },
    SK: {
      sortKey: true,
      hidden: true,
      prefix: "TEAM_ID#",
    },
    messageTs: ["PK", 0, { type: "string", required: true }],
    teamId: ["SK", 0, { type: "string", required: true }],
  },
  table: AgentTable,
} as const);

export type DDBMessage = EntityItem<typeof MessageEntity>;

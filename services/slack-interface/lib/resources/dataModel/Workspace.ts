import { Entity, EntityItem } from "dynamodb-toolbox";

import { SlackIntegrationTable } from "./Table";

export const WorkspaceEntity = new Entity({
  name: "WorkspaceItem",
  attributes: {
    PK: { partitionKey: true, hidden: true, prefix: "TEAM#" },
    SK: {
      sortKey: true,
      hidden: true,
      default: "WORKSPACE",
    },
    team_id: ["PK", 0, { type: "string", required: true }],
    name: { type: "string" },
    scope: { type: "list" },
    token_type: { type: "string" },
    access_token: { type: "string", required: true },
    bot_user_id: { type: "string", required: true },
    enterprise: { type: "string" },
  },
  table: SlackIntegrationTable,
} as const);

export type DDBWorkspace = EntityItem<typeof WorkspaceEntity>;


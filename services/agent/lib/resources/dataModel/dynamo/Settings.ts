import { Entity, EntityItem } from "dynamodb-toolbox";

import { AgentTable } from "./Table";

export const SettingsEntity = new Entity({
  name: "SettingsItem",
  attributes: {
    PK: { partitionKey: true, hidden: true, prefix: "TEAM_ID#" },
    SK: {
      sortKey: true,
      hidden: true,
      default: "SETTINGS",
    },
    teamId: ["PK", 0, { type: "string", required: true }],
  },
  table: AgentTable,
} as const);

export type DDBSettings = EntityItem<typeof SettingsEntity>;

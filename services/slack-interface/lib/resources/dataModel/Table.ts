import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Table } from "dynamodb-toolbox";

import { buildResourceName, getRegion } from "@event-driven-agents/helpers";

const documentClient = new DynamoDB({
  region: getRegion(),
});

export const SlackIntegrationTable = new Table({
  name: buildResourceName("slack-integration-table"),
  partitionKey: "PK",
  sortKey: "SK",
  indexes: {
    GSI1: {
      partitionKey: "GSI1PK",
      sortKey: "GSI1SK",
    },
  },
  DocumentClient: documentClient,
} as const);

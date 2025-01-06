import { Table } from "dynamodb-toolbox";

import { buildResourceName } from "@event-driven-agents/helpers";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient();

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
});

export const AgentTable = new Table({
  documentClient,
  name: buildResourceName("agent-table"),
  partitionKey: {
    name: "PK",
    type: "string",
  },
  sortKey: {
    name: "SK",
    type: "string",
  },
  indexes: {
    GSI1: {
      type: "global",
      partitionKey: {
        name: "GSI1PK",
        type: "string",
      },
      sortKey: {
        name: "GSI1SK",
        type: "string",
      },
    },
  },
} as const);

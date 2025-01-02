import { ToolDefinition, Tools } from "./schemas";

export const sendMessageDefinition: ToolDefinition = {
  name: Tools.sendMessage,
  description: "Send a reply message to the user",
  parameters: {
    properties: {
      message: {
        type: "string",
        description: "The message to send",
      },
    },
    required: ["message"],
  },
  output: null,
};

export const googleSearchDefinition: ToolDefinition = {
  name: Tools.googleSearch,
  description: "Search for information on Google",
  parameters: {
    properties: {
      query: {
        type: "string",
        description: "The search query",
      },
      k: {
        type: "number",
        description: "The number of results to return. Default is 1",
      },
    },
    required: ["query", "k"],
  },
  output: {
    properties: {
      result: {
        type: "string",
        description: "The summary of the top {{ k }} results",
      },
    },
  },
};

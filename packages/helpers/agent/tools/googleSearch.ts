import { ChatCompletionTool } from "openai/resources";
import { Tools } from "../schemas";

export const googleSearchDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: Tools.googleSearch,
    parameters: {
      type: "object",
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
  },
};

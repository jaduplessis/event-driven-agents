import { ToolDefinition, ToolEvent } from "./schemas";

export const sendMessageDefinition: ToolDefinition = {
  name: "send.message",
  description: "Send a reply message to the user",
  args: {
    message: {
      type: "string",
      description: "The message to send",
    },
  },
};

export interface SendMessageEvent extends ToolEvent {
  currentTool: {
    actionId: string;
    args: {
      message: string;
    };
  };
}

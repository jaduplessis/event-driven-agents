import { ToolsList } from "@event-driven-agents/helpers";
import { ChatCompletionMessageToolCall } from "openai/resources";

export const parseArguments = (
  toolCalls: ChatCompletionMessageToolCall[]
): ToolsList => {
  return toolCalls.map((toolCall) => {
    if (toolCall.function && toolCall.function.arguments) {
      const argumentsObject = JSON.parse(toolCall.function.arguments);
      return {
        ...toolCall,
        function: {
          ...toolCall.function,
          arguments: argumentsObject,
        },
      };
    } else {
      return toolCall;
    }
  });
};

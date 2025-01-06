import { ChatCompletionMessageParam } from "openai/resources";
import { loadThread } from "../../dataModel/dynamo/Thread";
import { constructSystemPrompt } from "./system";

export const constructMessages = async (
  thread_ts: string
): Promise<ChatCompletionMessageParam[]> => {
  const thread = await loadThread(thread_ts);
  const messages: ChatCompletionMessageParam[] = [];

  thread.forEach((item) => {
    switch (item.entity) {
      case "MessageItem":
        messages.push({
          role: "user",
          content: item.text,
        });
        break;
      case "ToolItem":
        messages.push(
          {
            role: "assistant",
            tool_calls: [
              {
                id: item.toolId,
                function: {
                  arguments: item.properties,
                  name: item.type,
                },
                type: "function",
              },
            ],
          },
          {
            role: "tool",
            tool_call_id: item.toolId,
            content: item.results,
          }
        );
        break;
      default:
        throw new Error("Invalid entity type");
    }
  });

  const systemPrompt = constructSystemPrompt();

  return [systemPrompt, ...messages];
};

import { getThreadMessages, MessageTypeInput } from "./Message";
import { getThreadToolUse, ToolTypeInput } from "./Tool";

type ThreadResponse = MessageTypeInput | ToolTypeInput;
type Thread = ThreadResponse[];

export const loadThread = async (thread_ts: string): Promise<Thread> => {
  const messages = await getThreadMessages(thread_ts);
  const tools = await getThreadToolUse(thread_ts);

  const thread = [...messages, ...tools].sort((a, b) => {
    if (!a.created) {
      return 1;
    }
    if (!b.created) {
      return -1;
    }
    return new Date(a?.created).getTime() - new Date(b.created).getTime();
  });

  return thread;
};

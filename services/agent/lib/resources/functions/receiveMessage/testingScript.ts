import {
  googleSearchDefinition,
  sendMessageDefinition,
} from "@event-driven-agents/helpers";
import { generateTasksList } from "../utils/generateTasksList";
import { constructSystemPrompt } from "./system";

export const runTest = async (text: string) => {
  const tools = [sendMessageDefinition, googleSearchDefinition];
  const systemPrompt = constructSystemPrompt(tools);
  const humanPrompt = text;

  return await generateTasksList({ systemPrompt, humanPrompt });
};

runTest("Where can I buy a Wizz kids chocolate bar?").then(console.log);

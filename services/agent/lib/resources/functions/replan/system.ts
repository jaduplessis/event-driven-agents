import { toolConstraints } from "../../prompts";
import { selfAwareGuideline } from "../../prompts/selfAwareGuideline";

interface ReplanSystemPromptParams {
  input: string | undefined;
  plan: string;
  planResults: string;
}

export const constructSystemPrompt = ({
  input,
  plan,
  planResults,
}: ReplanSystemPromptParams) => {
  return `For the given objective, come up with a simple step by step plan. 
This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps.
The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps.

Your objective was this:
${input}

Your original plan was this:
${plan}

You results to these steps are:
${planResults}

Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that and use the 'sendMessage' function.

If you are unable to complete the plan with the available tools, then send a message to the user with a summary of the current state of the plan and whats been achieved.

${selfAwareGuideline}

${toolConstraints}`;
};

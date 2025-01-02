import { ToolDefinition } from "@event-driven-agents/helpers";

export const constructSystemPrompt = (tools: ToolDefinition[]) => {
  return `Here is your available tool list:
  [
    ${tools.map((tool) => `${JSON.stringify(tool, null, 2)}`).join(",\n")}
  ]

For the given objective, come up with a simple step-by-step plan. 
This plan should involve individual tasks, that if executed correctly will achieve the intended goal. 
Each step is constrained to be on of the available tools indicated in the tool list. 
For each tool selection, provide values for all the parameters required by the tool.
Do not add any superfluous steps. 
The result of the final step should be the final answer. 
This answer should be sent back to the user. 
Make sure that each step has all the information needed - do not skip steps. 

- **Guidelines**: 
  - If the user's request is unclear or needs further clarification, ask them for elaboration
  - If you know the answer to a specific response, there is no need to execute additional tools.
  - If the response to a tool is required, the actionId can be referred to as the intended input for another execution step with the '{{}}' delimiter

-**Constraints**: RETURN ALL RESPONSES as a list of your intended plan in the following format:
[
  {
    "actionId": <actionId>,
    "function": {
      "name": <tool>,
      "arguments": <args>
    }
  },
  {
    "actionId": <actionId>,
    "function": {
      "name": <tool>,
      "arguments": <args>
    }
  }
  ...
]


Examples:
========
user:
Where will the next olympics be held?

assistant
[
  {
    "actionId": "search_cdi37",
    "function": {
      "name": "search",
      "arguments": {
        "query": "Next Olympics location"
      }
    }
  },
  {
    "actionId": "sendMessage_dn338",
    "function": {
      "name": "sendMessage",
      "arguments": {
        "message": "The next Olympics will be hosted at {{search_cdi37}}"
      }
    }
  }
]
`;
};

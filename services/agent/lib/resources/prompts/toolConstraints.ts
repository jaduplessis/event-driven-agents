export const toolConstraints = `
-**Constraints**: RETURN ALL RESPONSES as a list of your intended plan in the following format:
[
  {
    "id": <id>,
    "function": {
      "name": <tool>,
      "arguments": <args>
    }
  },
  {
    "id": <id>,
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
    "id": "search_cdi37",
    "function": {
      "name": "search",
      "arguments": {
        "query": "Next Olympics location"
      }
    }
  },
  {
    "id": "sendMessage_dn338",
    "function": {
      "name": "sendMessage",
      "arguments": {
        "message": "The next Olympics will be hosted at {{search_cdi37}}"
      }
    }
  }
]`;

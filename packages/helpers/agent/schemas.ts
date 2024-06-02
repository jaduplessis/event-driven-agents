/*
Tool schemas are divided into 3 sets:
1. ToolDefinition: 
This is the definition of the tool that is provided to the LLM. It is a JSON object that provides the 
necessary information for the LLM to use the tool and know when to use it

2. ToolRequest:
This is the request object that is sent to the tool. It is a JSON object that the LLM creates in order to
send to the tool.

3. ToolEvent:
This is the event object that is sent to the tool. It is based off of the ToolRequest object, but it is
extended to contain additional information that the tool may need to know about the event.
*/
export interface ToolDefinition {
  name: string;
  description: string;
  args: {
    [key: string]: {
      type: string;
      description: string;
    };
  };
}

export interface ToolRequest {
  tool: string;
  args: {
    [key: string]: any;
  };
  actionId: string;
}

export interface BaseEvent {
  core: {
    accessToken: string;
    user_id: string;
    teamId: string;
    channel?: string;
  };
}

export interface ToolEvent extends BaseEvent {
  currentTool: {
    actionId: string;
    args: {
      [key: string]: any;
    };
  }
  followingTools: ToolRequest[];
}



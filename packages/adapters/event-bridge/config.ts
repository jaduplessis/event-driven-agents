import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandOutput,
  PutEventsRequestEntry,
} from "@aws-sdk/client-eventbridge";
import { agentEventSchema, getEnvVariable } from "@event-driven-agents/helpers";

let client: EventBridgeClient | undefined;

export class EventBridgeAdapter {
  eventBus: string;

  constructor(eventBus: string = getEnvVariable("EVENT_BUS")) {
    this.eventBus = eventBus;
  }

  putEvent(
    source: string,
    payload: Record<string, unknown>,
    detailType: string
  ): Promise<PutEventsCommandOutput> {
    console.log(
      `Event being sent from ${source} with detail type ${detailType}`
    );
    const eventTime = Date.now();

    const { processingStep } = agentEventSchema.parse(payload);

    const event: PutEventsRequestEntry = {
      Source: source,
      Detail: JSON.stringify({
        ...payload,
        processingStep: processingStep + 1,
        eventTime,
      }),
      DetailType: detailType,
      EventBusName: this.eventBus,
    };

    // Construct client on cold start
    if (client == null) {
      client = new EventBridgeClient();
    }

    // Create put command
    const command: PutEventsCommand = new PutEventsCommand({
      Entries: [event],
    });

    return client.send(command);
  }
}

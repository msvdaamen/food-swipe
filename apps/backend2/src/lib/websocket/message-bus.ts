import type { RedisClient } from "bun";
import type { WebsocketEvent } from "./types";

type Message = {
  room: string;
  event: WebsocketEvent
}

type MessageBusSubscriber = (message: Message) => void | Promise<void>;

export interface MessageBus {
  publish(message: Message): void;
  subscribe(callback: MessageBusSubscriber): Promise<void>;
}

export class RedisMessageBus implements MessageBus {
  private readonly WEBSOCKET_BUS_CHANNEL = "websocket";

  constructor(
    private readonly client: RedisClient,
    private readonly subscriber: RedisClient
  ) { }

  publish(message: Message): void {
    this.client.publish(this.WEBSOCKET_BUS_CHANNEL, JSON.stringify(message));
  }

  async subscribe(callback: MessageBusSubscriber): Promise<void> {
    await this.subscriber.subscribe(this.WEBSOCKET_BUS_CHANNEL, (message) => {
      const parsedMessage = JSON.parse(message) as Message;
      callback(parsedMessage);
    });
  }
}

export class LocalMessageBus implements MessageBus {
  subscriber: MessageBusSubscriber | null = null;

  publish(message: Message): void {
    if (this.subscriber) {
      this.subscriber(message);
    }
  }

  async subscribe(callback: MessageBusSubscriber): Promise<void> {
    this.subscriber = callback;
  }
}

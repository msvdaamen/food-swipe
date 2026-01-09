import type { ServerWebSocket } from "bun";
import { type } from "arktype";
import type {
  IWebsocketHandler,
  IWebsocketServer,
  WebsocketEvent,
  WebsocketHandlerFn,
  WebsocketServerData,
} from "./types";
import { WebsocketMessageContext } from "./context";
import { RedisMessageBus, type MessageBus } from "./message-bus";
import { cacheProvider } from "../../providers/cache.provider";
import { natsProvider } from "../../providers/nats.provider";

const messageValidator = type({
  type: "string",
  "data?": "unknown",
});

export class WebSocketServer implements IWebsocketServer {
  private readonly listeners = new Map<string, WebsocketHandlerFn[]>();
  private _server!: Bun.Server<WebsocketServerData>;

  constructor(private readonly messageBus: MessageBus) {}

  async start(server: Bun.Server<WebsocketServerData>): Promise<void> {
    this._server = server;
    await this.messageBus.subscribe((message) => {
      this.server.publish(message.room, JSON.stringify(message.event));
    });
  }

  get server(): Bun.Server<WebsocketServerData> {
    if (!this._server) {
      throw new Error("Server not started");
    }
    return this._server;
  }

  registerHandler(handler: IWebsocketHandler) {
    for (const [event, callback] of handler.getListeners()) {
      const exisitngHandlers = this.listeners.get(event) || [];
      exisitngHandlers.push(callback);
      this.listeners.set(event, exisitngHandlers);
    }
  }

  onConnect(ws: ServerWebSocket<WebsocketServerData>) {
    const { userId } = ws.data;
    ws.subscribe(`user-${userId}`);
  }

  onDisconnect(ws: ServerWebSocket<WebsocketServerData>) {
    const { userId } = ws.data;
    ws.unsubscribe(`user-${userId}`);
  }

  onMessage(
    ws: ServerWebSocket<WebsocketServerData>,
    data: string | Buffer<ArrayBuffer>,
  ) {
    if (Buffer.isBuffer(data)) {
      return;
    }

    try {
      const event = JSON.parse(data) as WebsocketEvent;
      const validated = messageValidator(event);

      if (validated instanceof type.errors) {
        console.error("Invalid message:", validated);
        return;
      }
      const handlers = this.listeners.get(event.type);
      if (!handlers) return;
      const context = new WebsocketMessageContext(event.data, ws, this);
      for (const handler of handlers) {
        handler(context);
      }
    } catch (error) {
      console.error(error);
    }
  }

  publish(room: string, event: WebsocketEvent) {
    this.messageBus.publish({
      room,
      event,
    });
  }

  send(userId: string, event: WebsocketEvent) {
    this.messageBus.publish({
      room: `user-${userId}`,
      event,
    });
  }
}

const websocketMessageBus = new RedisMessageBus(
  cacheProvider,
  await cacheProvider.duplicate(),
);
export const websocketServer = new WebSocketServer(websocketMessageBus);

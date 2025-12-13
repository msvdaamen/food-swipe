import type { ServerWebSocket } from "bun";
import type { IWebsocketMessageContext, IWebsocketServer, WebsocketEvent, WebsocketServerData } from "./types";

export class WebsocketMessageContext<D = unknown> implements IWebsocketMessageContext<D> {

  constructor(
    private readonly _data: D | undefined,
    public readonly ws: ServerWebSocket<WebsocketServerData>,
    private readonly server: IWebsocketServer
  ) {}

  public get data(): D | undefined {
    return this._data;
  }

  publish<T = unknown>(room: string, message: WebsocketEvent<T>) {
    this.server.publish(room, message);
  }
  send<T = unknown>(message: WebsocketEvent<T>) {
    this.server.publish(`user-${this.ws.data.userId}`, message);
  }
}

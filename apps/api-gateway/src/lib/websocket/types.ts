export interface IWebsocketServer {
  start(server: Bun.Server<WebsocketServerData>): void | Promise<void>;
  publish(room: string, message: WebsocketEvent): void
  send(userId: string, message: WebsocketEvent): void
}

export interface IWebsocketHandler {
  on(event: string, callback: WebsocketHandlerFn): void
  getListeners(): [string, WebsocketHandlerFn][];
}

export type WebsocketServerData = {
  userId: string;
};

export interface IWebsocketMessageContext<D = unknown> {
  get data(): D | undefined;

  publish(room: string, message: WebsocketEvent): void;
  send(message: WebsocketEvent): void;
}

export type WebsocketHandlerFn = (context: IWebsocketMessageContext) => void | Promise<void>;

export type WebsocketEvent<T = unknown> = {
  type: string;
  data?: T;
}


export interface IWebsocketService {
  publish(room: string, event: WebsocketEvent): void;
  send(userId: string, event: WebsocketEvent): void;
}

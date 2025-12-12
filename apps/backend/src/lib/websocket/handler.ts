import type { IWebsocketHandler, WebsocketHandlerFn } from "./types";

export class WebsocketHandler implements IWebsocketHandler {
  private readonly listeners: [string, WebsocketHandlerFn][] = [];

  constructor() {}

  on(event: string, callback: WebsocketHandlerFn) {
    this.listeners.push([event, callback]);
  }

  getListeners(): [string, WebsocketHandlerFn][] {
    return this.listeners;
  }
}

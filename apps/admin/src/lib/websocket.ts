const url = import.meta.env.VITE_API_URL! || "http://localhost:3000";
let websocketClient: WebSocketClient | null = null;

export const useWebsocket = () => {
  if (!websocketClient) {
    const wsUrl = url.replace(/http(s)?:\/\//, 'ws$1://');
    websocketClient = new WebSocketClient(`${wsUrl}/ws`);
  }
  return websocketClient;
};

export const getWebsocketClient = () => {
  return websocketClient;
};

type WebsocketEvent<T = unknown> = {
  type: string;
  data?: T;
};

type WebsocketEventListener<T = unknown> = (data: T, event: string) => void;

class WebSocketClient {
  private socket: WebSocket | null = null;
  private intervalId: number | NodeJS.Timeout | null = null;
  private retryCount = 0;
  private readonly listeners = new Map<WebsocketEvent['type'], Set<WebsocketEventListener<any>>>();

  constructor(
    private readonly url: string
  ) { }

  connect() {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(this.url);
      this.socket?.addEventListener('open', this.onOpen.bind(this));
      this.socket?.addEventListener('close', this.onClose.bind(this));
      this.socket?.addEventListener('error', this.onError.bind(this));
      this.socket?.addEventListener('message', this.onMessage.bind(this));
    }
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const type = data.type;
    const listeners = this.listeners.get(type);
    if (listeners) {
      for (const listener of listeners) {
        listener(data.data, type);
      }
    }
  }

  onError() {
    console.log('WebSocket error');
  }

  onOpen() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.retryCount = 0;
    }
  }

  onClose(event: CloseEvent) {
    if (!event.wasClean) {
      this.reconnect();
    }
  }

  reconnect() {
    this.connect();
    this.intervalId = setInterval(() => {
      this.connect();
    }, (this.retryCount ^ 2) * 3000);
  }

  send<T>(message: WebsocketEvent<T>) {
    this.socket?.send(JSON.stringify(message));
  }

  addEventListener<T, Event extends WebsocketEvent<T> = WebsocketEvent<T>>(type: Event['type'], listener: WebsocketEventListener<T>) {
    const listeners = this.listeners.get(type) || new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener<T, Event extends WebsocketEvent<T> = WebsocketEvent<T>>(type: Event['type'], listener: WebsocketEventListener<T>) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(type);
      }
    }
  }
}

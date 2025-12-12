import { type } from "arktype";
import { WebsocketHandler } from "../lib/websocket/handler";


export const testWebsocket = new WebsocketHandler();

const testValidator = type("string")

testWebsocket.on('ping', async (c) => {
  const data = testValidator(c.data);
  c.send({
    type: 'pong'
  });
});

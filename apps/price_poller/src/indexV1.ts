import WebSocket from "ws";
import "dotenv/config";

const BACKPACK_WS = process.env.BACKPACK_WS_API;
if (!BACKPACK_WS) {
  throw new Error("BACKPACK Websocket API not defined");
}

const ws = new WebSocket(`${BACKPACK_WS}`);

ws.on("open", () => {
  console.log("connected");

  const subscribe = {
    id: 1,
    method: "SUBSCRIBE",
    params: ["bookTicker.SOL_USDC"],
  };
  console.log("logging subscribe as string: ");
  console.log(JSON.stringify(subscribe));

  ws.send(JSON.stringify(subscribe));

  ws.on("message", (message) => {
    console.log("message received: ", message.toString());
  });
});

ws.on("close", (close) => {
  console.log("disconnected: ", close);
});

ws.on("error", (error) => {
  console.log("error encounter: ", error);
});

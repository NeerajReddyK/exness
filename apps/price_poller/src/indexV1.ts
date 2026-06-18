import WebSocket from "ws";
import "dotenv/config";
import { redisClient } from "./redisClient.js";

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
  let SOL_ask = 0;
  let SOL_bid = 0;
  redisClient.connect();

  ws.on("message", (message) => {
    console.log("message received: ", message.toString());
    const obj = JSON.parse(message.toString());
    SOL_ask = obj.a;
    SOL_bid = obj.b;
  });

  setInterval(() => {
    const xadd = redisClient.xAdd("demo:demo", "*", {asset: "SOLUSDT", ask: `${SOL_ask}`, bid: `${SOL_bid}`});
    console.log("xadd: ", xadd);
  }, 100);

});

ws.on("close", (close) => {
  console.log("disconnected: ", close);
});

ws.on("error", (error) => {
  console.log("error encounter: ", error);
});

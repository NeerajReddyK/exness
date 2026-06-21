import WebSocket from "ws";
import "dotenv/config";
import { redisClient } from "./redisClient.js";

const BACKPACK_WS = process.env.BACKPACK_WS_API;
if (!BACKPACK_WS) {
  throw new Error("BACKPACK Websocket API not defined");
}

const ws = new WebSocket(`${BACKPACK_WS}`);

ws.on("open", async () => {
  console.log("connected");

  const subscribe = {
    id: 1,
    method: "SUBSCRIBE",
    params: ["bookTicker.SOL_USDC"],
  };
  console.log(JSON.stringify(subscribe));

  ws.send(JSON.stringify(subscribe));
  let SOL_ask: number | null =  null;
  let SOL_bid: number | null = null;

  ws.on("message", (message) => {
    const obj = JSON.parse(message.toString());
    SOL_ask = obj.data.a;
    SOL_bid = obj.data.b;
  });

  setInterval(async () => {
    if(!SOL_ask || !SOL_bid) {
      return;
    }
    const xadd = await redisClient.xAdd("stream1:poller", "*", {asset: "SOLUSDC", ask: `${SOL_ask}`, bid: `${SOL_bid}`});
    console.log("xadd: ", xadd);
  }, 100);

});

ws.on("close", async (close) => {
  await redisClient.quit();
  console.log("closed redis connection");
  console.log("disconnected: ", close);
});

ws.on("error", (error) => {
  console.log("error encountered on backpack websocket: ", error);
});

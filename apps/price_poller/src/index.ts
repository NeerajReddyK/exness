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
    params: [
      "bookTicker.SOL_USDC",
      "bookTicker.BTC_USDC",
      "bookTicker.ETH_USDC",
    ],
  };
  console.log(JSON.stringify(subscribe));

  ws.send(JSON.stringify(subscribe));
  let SOL_ask: number | null = null;
  let SOL_bid: number | null = null;

  let BTC_ask: number | null = null;
  let BTC_bid: number | null = null;

  let ETH_ask: number | null = null;
  let ETH_bid: number | null = null;

  ws.on("message", (message) => {
    const obj = JSON.parse(message.toString());
    if (obj.data.s === "SOL_USDC") {
      SOL_ask = obj.data.a;
      SOL_bid = obj.data.b;
    } else if (obj.data.s === "BTC_USDC") {
      BTC_ask = obj.data.a;
      BTC_bid = obj.data.b;
    } else if (obj.data.s === "ETH_USDC") {
      ETH_ask = obj.data.a;
      ETH_bid = obj.data.b;
    }
  });

  setInterval(async () => {
    if (
      SOL_ask === null ||
      SOL_bid === null ||
      BTC_ask === null ||
      BTC_bid === null ||
      ETH_ask === null ||
      ETH_bid === null
    ) {
      return;
    }
    try {
      const id = await redisClient.xAdd("stream1:poller", "*", {
        type: "price-update",
        SOL_ask: SOL_ask.toString(),
        SOL_bid: SOL_bid.toString(),
        BTC_ask: BTC_ask.toString(),
        BTC_bid: BTC_bid.toString(),
        ETH_ask: ETH_ask.toString(),
        ETH_bid: ETH_bid.toString(),
      });
      await redisClient.hSet("update_prices", {
        streamId: id,
        SOL_ask,
        SOL_bid,
        BTC_ask,
        BTC_bid,
        ETH_ask,
        ETH_bid,
      });
    } catch (error) {
      console.error("error while updating redis: ", error);
    }
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

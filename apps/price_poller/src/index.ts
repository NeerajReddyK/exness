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
    if (!SOL_ask || !SOL_bid) {
      return;
    }
    if (SOL_ask && SOL_bid) {
      await redisClient.xAdd("stream1:poller", "*", {
        type: "price-update",
        asset: "SOL_USDC",
        ask: `${SOL_ask}`,
        bid: `${SOL_bid}`,
      });
    }

    if (BTC_ask && BTC_bid) {
      await redisClient.xAdd("stream1:poller", "*", {
        type: "price-update",
        asset: "BTC_USDC",
        ask: `${BTC_ask}`,
        bid: `${BTC_bid}`,
      });
    }

    if (ETH_ask && ETH_bid) {
      await redisClient.xAdd("stream1:poller", "*", {
        type: "price-update",
        asset: "ETH_USDC",
        ask: `${ETH_ask}`,
        bid: `${ETH_bid}`,
      });
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

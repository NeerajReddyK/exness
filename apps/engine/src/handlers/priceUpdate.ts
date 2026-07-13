import type { priceUpdateTypes } from "../types.js";
import { PRICESTORE } from "../variables.js";

export const priceUpdate = (msg: priceUpdateTypes) => {
  if (msg.message.asset === "SOL_USDC") {
    PRICESTORE["SOL_USDC"].ask = Number(msg.message.ask);
    PRICESTORE["SOL_USDC"].bid = Number(msg.message.bid);
  } else if (msg.message.asset === "BTC_USDC") {
    PRICESTORE["BTC_USDC"].ask = Number(msg.message.ask);
    PRICESTORE["BTC_USDC"].bid = Number(msg.message.bid);
  } else if (msg.message.asset === "ETH_USDC") {
    PRICESTORE["ETH_USDC"].ask = Number(msg.message.ask);
    PRICESTORE["ETH_USDC"].bid = Number(msg.message.bid);
  }
};

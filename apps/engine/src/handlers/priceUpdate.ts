import type { priceUpdateTypes } from "../types.js";
import { PRICESTORE } from "../variables.js";

export const priceUpdate = (msg: priceUpdateTypes) => {
  if (msg.message.asset === "SOLUSDC") {
    PRICESTORE["SOL"].ask = Number(msg.message.ask);
    PRICESTORE["SOL"].bid = Number(msg.message.bid);
  } else if (msg.message.asset === "BTCUSDC") {
    PRICESTORE["BTC"].ask = Number(msg.message.ask);
    PRICESTORE["BTC"].bid = Number(msg.message.bid);
  } else if (msg.message.asset === "ETHUSDC") {
    PRICESTORE["ETH"].ask = Number(msg.message.ask);
    PRICESTORE["ETH"].bid = Number(msg.message.bid);
  }
};

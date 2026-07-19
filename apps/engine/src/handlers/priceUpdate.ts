import type { priceUpdateTypes } from "../types.js";
import { PRICESTORE } from "../variables.js";

export const priceUpdate = (msg: priceUpdateTypes) => {
  const prices = msg.message;
  if (prices.SOL_ask && prices.SOL_bid) {
    PRICESTORE["SOL_USDC"].ask = Number(prices.SOL_ask);
    PRICESTORE["SOL_USDC"].bid = Number(prices.SOL_bid);
  } else if (prices.BTC_ask && prices.BTC_bid) {
    PRICESTORE["BTC_USDC"].ask = Number(prices.BTC_ask);
    PRICESTORE["BTC_USDC"].bid = Number(prices.BTC_bid);
  } else if (prices.ETH_ask && prices.ETH_bid) {
    PRICESTORE["ETH_USDC"].ask = Number(prices.ETH_ask);
    PRICESTORE["ETH_USDC"].bid = Number(prices.ETH_bid);
  }
};

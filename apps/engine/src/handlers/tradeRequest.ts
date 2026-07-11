import { redisClient } from "../redisClient.js";
import type { tradeRequestTypes } from "../types.js";
import { BALANCES, PRICESTORE } from "../variables.js";

export const buyRequest = async (msg: tradeRequestTypes) => {
  try {
    const { message } = msg;
    const { tradeId, userId, asset, quantity } = message;
    if (!BALANCES[userId]) {
      BALANCES[userId] = {
        usd: 5000,
        asset: {
          SOL: 0,
          BTC: 0,
          ETH: 0,
        },
      };
    }
    let assetType = "";
    let assetPrice = 0;
    if (asset === "SOLUSDC") {
      assetType = "SOL";
      assetPrice = PRICESTORE.SOL.ask;
    } else if (asset === "BTCUSD") {
      assetType = "BTC";
      assetPrice = PRICESTORE.BTC.ask;
    } else if (asset === "ETHUSD") {
      assetType = "ETH";
      assetPrice = PRICESTORE.ETH.ask;
    }

    if (BALANCES[userId].usd > assetPrice) {
      BALANCES[userId].usd -= assetPrice;
      BALANCES[userId].asset.SOL += parseInt(quantity);
    } else {
      console.log("low balance");
      return;
    }
    const updatedBalance = JSON.stringify(BALANCES[userId]);
    await redisClient.xAdd("stream2:backend", "*", {
      type: "trade-response",
      tradeId,
      userId,
      updatedBalance,
    });
  } catch (error) {
    console.log("error in buyRequest: ", error);
  }
};

export const sellRequest = (msg: tradeRequestTypes) => {
  const { message } = msg;
  const { tradeId, userId, asset, quantity } = message;
  if (!BALANCES[userId]) {
    // should start by handling this
  }
};
/*
    msg: {
      id: '1783332944195-0',
        message: {
            type: 'trade-request',
            tradeId: '0.27897133104248284',
            userId: '123',
            asset: 'SOLUSDC',
            bid: '220'
        }
      }
    */

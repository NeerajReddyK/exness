import { redisClient } from "../redisClient.js";
import { SYMBOL_MAP, type tradeRequestTypes } from "../types.js";
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

    const assetType = SYMBOL_MAP[asset];
    const assetPrice = PRICESTORE[assetType].ask;

    if (BALANCES[userId].usd >= assetPrice) {
      BALANCES[userId].usd -= assetPrice;
      BALANCES[userId].asset.SOL += parseInt(quantity);
    } else {
      await redisClient.xAdd("stream2:backend", "*", {
        type: "trade-buy-response",
        userId,
        tradeId,
        message: "Low Balance",
      });
      return;
    }
    const updatedBalance = JSON.stringify(BALANCES[userId]);
    await redisClient.xAdd("stream2:backend", "*", {
      type: "trade-buy-response",
      tradeId,
      userId,
      message: "Success",
      updatedBalance,
    });
  } catch (error) {
    console.log("error in buyRequest: ", error);
  }
};

export const sellRequest = async (msg: tradeRequestTypes) => {
  const { message } = msg;
  const { tradeId, userId, asset, quantity } = message;
  if (!BALANCES[userId]) {
    // should return because user don't have any assets.
    console.log("inside !BALANCES[userId]");
    const xadd = await redisClient.xAdd("stream2:backend", "*", {
      type: "trade-sell-response",
      tradeId,
      userId,
      message: "No asset available",
      updatedBalance: "0",
    });
    console.log("xadd: ", xadd);
    return;
  }

  const assetType = SYMBOL_MAP[asset];
  const assetPrice = Number(PRICESTORE[assetType].ask);
  if (!(BALANCES[userId].asset[assetType] >= parseInt(quantity))) {
    const updatedBalance = JSON.stringify(BALANCES[userId]);
    await redisClient.xAdd("stream2:backend", "*", {
      type: "trade-sell-response",
      userId,
      tradeId,
      message: "Fail",
      updatedBalance,
    });
    return;
  }
  BALANCES[userId].usd += assetPrice;
  BALANCES[userId].asset[assetType] -= parseInt(quantity);
  const updatedBalance = JSON.stringify(BALANCES[userId]);

  const xread = await redisClient.xAdd("stream2:backend", "*", {
    type: "trade-sell-response",
    userId,
    tradeId,
    message: "Success",
    updatedBalance,
  });
  console.log("added to stream2:backend: ", xread);

  return;
};

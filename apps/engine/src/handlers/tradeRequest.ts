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
          SOL_USDC: 0,
          BTC_USDC: 0,
          ETH_USDC: 0,
        },
      };
    }

    const assetPrice = PRICESTORE[asset].ask;
    const quantityInt = Number(quantity);

    if (BALANCES[userId].usd >= assetPrice * quantityInt) {
      BALANCES[userId].usd -= assetPrice * quantityInt;
      BALANCES[userId].asset[asset] += quantityInt;
    } else {
      const updatedBalance = JSON.stringify(BALANCES[userId]);
      await redisClient.xAdd("stream2:backend", "*", {
        type: "trade-buy-response",
        userId,
        tradeId,
        message: "Low Balance",
        updatedBalance,
      });
      return;
    }
    const updatedBalance = JSON.stringify(BALANCES[userId]);
    const responseToBackend = {
      type: "buy",
      requestedAsset: asset,
      executedPrice: assetPrice,
      requestedQuantity: quantityInt,
      updatedBalance,
    };
    const response = JSON.stringify(responseToBackend);
    await redisClient.xAdd("stream2:backend", "*", {
      type: "trade-buy-response",
      tradeId,
      userId,
      message: "Success",
      response,
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

  const quantityInt = Number(quantity);
  const assetPrice = Number(PRICESTORE[asset].ask);
  if (!(BALANCES[userId].asset[asset] >= quantityInt)) {
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
  BALANCES[userId].usd += assetPrice * quantityInt;
  BALANCES[userId].asset[asset] -= quantityInt;
  const updatedBalance = JSON.stringify(BALANCES[userId]);
  const responseToBackend = {
    type: "sell",
    requestedAsset: asset,
    executedPrice: assetPrice,
    requestedQuantity: quantityInt,
    updatedBalance,
  };
  const response = JSON.stringify(responseToBackend);

  const xread = await redisClient.xAdd("stream2:backend", "*", {
    type: "trade-sell-response",
    userId,
    tradeId,
    message: "Success",
    response,
  });
  console.log("added to stream2:backend: ", xread);

  return;
};

import { redisClient } from "../redisClient.js";
import type { tradeRequestTypes } from "../types.js";
import { BALANCES, PRICESTORE } from "../variables.js";

export const tradeRequest = async (msg: tradeRequestTypes) => {
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

  // here, I have to update the balance of the user, buy them the asset.
  // as of now, will take only buy to limit complexity

  // exness doesn't really buy the asset. It mocks buying an asset
  // so, usd balance should decrease and asset balance should increase
  const { id, message } = msg;
  const { tradeId, userId, asset, bid } = message;
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
  // should support two types: buy and sell. supporting buy only for now.
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

  // BALANCES["user1"]!.usd -= 100;
  // BALANCES["user1"]!.asset["SOL"] += 2;
  if (BALANCES[userId].usd > assetPrice) {
    BALANCES[userId].usd -= assetPrice;
    BALANCES[userId].asset.SOL += 1;
  } else {
    console.log("low balance");
    return;
  }
  console.log("completed trade request");
  console.log("balances of user: ", userId);
  console.log(BALANCES[userId]);
  const updatedBalance = BALANCES[userId].usd.toString();
  const xadd = await redisClient.xAdd("stream2:backend", "*", {
    type: "trade-response",
    tradeId,
    userId,
    updatedBalance,
  });
  if (xadd) {
    console.log("xadd to stream2:backend done", xadd);
  }
  console.log("exiting tradeRequest here. should check whether exiting or not");
  // added auth. now, should use userId insted of user1, user2 which I am using now.
};

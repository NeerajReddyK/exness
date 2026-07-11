// read from stream1:poller and update pricestore.

import { tradeRequest } from "./handlers/tradeRequest.js";
import { redisClient } from "./redisClient.js";
import { PRICESTORE } from "./variables.js";

const cGroup = async () => {
  console.log("cGroup started");
  try {
    await redisClient.xGroupCreate("stream1:poller", "stream1:cgroup", "0", {
      MKSTREAM: true,
    });
  } catch (error) {
    // Ignone BUSY
  }

  while (true) {
    const readGroup = await redisClient.xReadGroup(
      "stream1:cgroup",
      "c-1",
      {
        key: "stream1:poller",
        id: ">",
      },
      {
        BLOCK: 0,
      },
    );
    if (!readGroup) {
      console.log("!readGroup");
      continue;
    }

    console.log("readgroup length: ", readGroup.length);
    for (const stream of readGroup) {
      for (const msg of stream.messages) {
        if (msg.message.type === "price-update") {
          if (msg.message.asset === "SOLUSDC") {
            PRICESTORE["SOL"].ask = msg.message.ask;
            PRICESTORE["SOL"].bid = msg.message.bid;
          }
        } else if (msg.message.type === "trade-request") {
          console.log("logging msg for trade-request: ", msg);
          // adding logic. incomplete for now.
          tradeRequest(msg);
          console.log(
            "in index.ts after completing tradeRequest and updating balances",
          );
        }

        await redisClient.xAck("stream1:poller", "stream1:cgroup", msg.id);
      }
    }
    console.log("pricestore: ", PRICESTORE);
  }
};

cGroup();

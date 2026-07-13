// read from stream1:poller and update pricestore.

import { priceUpdate } from "./handlers/priceUpdate.js";
import { buyRequest, sellRequest } from "./handlers/tradeRequest.js";
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

    for (const stream of readGroup) {
      for (const msg of stream.messages) {
        if (msg.message.type === "price-update") {
          priceUpdate(msg);
        } else if (msg.message.type === "trade-buy") {
          buyRequest(msg);
        } else if (msg.message.type === "trade-sell") {
          sellRequest(msg);
        }

        await redisClient.xAck("stream1:poller", "stream1:cgroup", msg.id);
      }
    }
    console.log("pricestore: ", PRICESTORE);
  }
};

cGroup();

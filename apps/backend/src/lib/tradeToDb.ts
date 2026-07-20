import { createClient } from "redis";
import { prisma } from "./prisma.js";

const tradeToDb = async () => {
  const redisClient = createClient();
  await redisClient.connect();
  while (true) {
    const xread = await redisClient.xRead(
      {
        key: "stream3:trades",
        id: "$",
      },
      { BLOCK: 0, COUNT: 1 },
    );
    if (!xread) continue;

    const message = xread[0]?.messages[0].message;
    const addToDb = await prisma.trades.create({
      data: {
        tradeId: message.tradeId,
        userId: message.userId,
        status: message.status,
        asset: message.asset,
        type: message.type,
        issuePrice: Number(message.issuePrice),
        quantity: Number(message.quantity),
      },
    });
  }
};
export default tradeToDb;

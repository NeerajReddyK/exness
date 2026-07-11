import express, { Router } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { tradeSchema } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../lib/redisClient.js";
import { RedisSubscriber } from "../lib/redisSubscriber.js";

const router: Router = express.Router();

const redisSubscriber = new RedisSubscriber();

router.post("/trade/buy", async (req, res) => {
  try {
    const { success } = tradeSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const { token, asset, bid, quantity } = req.body;
    const jwt_check = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!jwt_check) {
      return res.status(401).json({ message: "invalid token" });
    }
    const userId = jwt_check.userId;
    const tradeId = uuidv4();
    console.log("added to stream1:poller");
    const xadd = await redisClient.xAdd("stream1:poller", "*", {
      type: "trade-request",
      userId,
      tradeId,
      asset,
      bid,
      quantity,
    });

    // should check whether this try-catch is required.
    try {
      const responseFromEngine = await redisSubscriber.waitForMessage(tradeId);
      console.log("response from engine: ", responseFromEngine);
      return res.status(200).json({
        message: "request complete",
        usd: responseFromEngine,
      });
    } catch (error) {
      return res.status(400).json({ message: "waitForMessage error", error });
    }
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({
      message: "Failure",
      reason: "Internal server error",
      errorLog: error,
    });
  }
});

router.post("/trade/sell", (req, res) => {
  try {
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({
      message: "Failure",
      reason: "Internal server error",
      errorLog: error,
    });
  }
});

export default router;

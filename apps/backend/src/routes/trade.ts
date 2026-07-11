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
    const { token, asset, quantity } = req.body;
    const jwt_check = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!jwt_check) {
      return res
        .status(401)
        .json({ message: "Fail", reason: "invalid token", errorLog: null });
    }
    const userId = jwt_check.userId;
    const tradeId = uuidv4();
    console.log("added to stream1:poller");
    const xadd = await redisClient.xAdd("stream1:poller", "*", {
      type: "trade-request",
      userId,
      tradeId,
      asset,
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

router.post("/trade/sell", async (req, res) => {
  try {
    const { success, error } = tradeSchema.safeParse(req.body);
    if (!success) {
      return res
        .status(400)
        .json({ message: "Fail", reason: "Invalid params", errorLog: error });
    }
    const { token, asset, quantity } = req.body;
    // send the request to the engine and then wait for result
    const jwt_check = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!jwt_check) {
      return res
        .status(401)
        .json({ message: "Fail", reason: "invalid token", errorLog: null });
    }
    const userId = jwt_check.userId;
    const tradeId = uuidv4();
    const xadd = redisClient.xAdd("stream1:poller", "*", {
      type: "trade-buy",
      userId,
      tradeId,
      asset,
      quantity,
    });
    console.log("xadd", xadd);

    // wait for response
    const responseFromEngine = await redisSubscriber.waitForMessage(tradeId);
    const returnResponse = JSON.parse(responseFromEngine as string);
    return res.status(200).json({ message: "success", data: returnResponse });
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

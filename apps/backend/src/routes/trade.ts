import express, { Router } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { tradeSchema } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../lib/redisClient.js";
import { RedisSubscriber } from "../lib/redisSubscriber.js";

const router: Router = express.Router();

const redisSubscriber = new RedisSubscriber();

router.post("/buy", async (req, res) => {
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
    const xadd = await redisClient.xAdd("stream1:poller", "*", {
      type: "trade-buy",
      userId,
      tradeId,
      asset,
      quantity,
    });
    console.log("added to stream1:poller", xadd);

    // should check whether this try-catch is required.
    try {
      console.log("started waiting for responseFromEngine");
      const responseFromEngine = await redisSubscriber.waitForMessage(tradeId);
      console.log("responseFromEngine: ", responseFromEngine);
      return res.status(200).json({
        message: "request complete",
        usd: responseFromEngine,
      });
    } catch (error) {
      console.log("error waiting from engine: ", error);
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

router.post("/sell", async (req, res) => {
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
    const xadd = await redisClient.xAdd("stream1:poller", "*", {
      type: "trade-sell",
      userId,
      tradeId,
      asset,
      quantity,
    });
    console.log("xadd", xadd);

    // wait for response
    console.log("entering into responseFromEngine");
    const responseFromEngine = await redisSubscriber.waitForMessage(tradeId);
    console.log("responseFromEngine: ", responseFromEngine);
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

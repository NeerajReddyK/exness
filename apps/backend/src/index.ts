import express from "express";
import { redisClient } from "./redisClient.js";
import authRouter from "./auth.js";
import { tradeSchema } from "./types.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RedisSubscriber } from "./redisSubscriber.js";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

const redisSubscriber = new RedisSubscriber();

app.post("/trade/buy", async (req, res) => {
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
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

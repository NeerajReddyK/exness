import express from "express";
import { redisClient } from "./redisClient.js";

const app = express();
app.use(express.json());

app.post("/trade/open", async (req, res) => {
  // send the request to stream1:poller
  try {
    const { userId, asset, bid } = req.body;
    const tradeId = Math.random().toString();
    const xadd = await redisClient.xAdd("stream1:poller", "*", {
      type: "trade-request",
      tradeId,
      userId,
      asset,
      bid,
    });
    console.log("xadd: ", xadd);

    // once it is added, it should wait till stream2 responds. this is the tricky bit (unseen bit)
    return res.status(200).json({ message: "request complete" });
  } catch (error) {
    console.error("error: ", error);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

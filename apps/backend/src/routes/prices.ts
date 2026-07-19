import express, { Router } from "express";
import { redisClient } from "../lib/redisClient.js";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const prices = await redisClient.hGetAll("update_prices");
    console.log("prices: ", prices);
    return res.status(200).json({ message: "Success", data: prices });
  } catch (error) {
    console.error("error: ", error);
    return res
      .status(500)
      .json({ message: "Fail", data: "Internal server error" });
  }
});

export default router;

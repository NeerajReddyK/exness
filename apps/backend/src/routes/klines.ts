import express, { Router } from "express";
import axios from "axios";

const router: Router = express.Router();

router.get("/api/v1/klines", async (req, res) => {
  try {
    const { symbol, interval, startTime } = req.query;
    if (!symbol || !interval || !startTime) {
      return res.status(400).json({
        message: "Fail",
        data: "symbol, interval, startTime are required",
      });
    }
    const BackpackUrl = process.env.BACKPACK_URL;
    if (!BackpackUrl) {
      console.error("Backpack url undefined");
      return;
    }
    const response = await axios.get(
      `${BackpackUrl}/api/v1/klines?&symbol=${symbol}&interval=${interval}&startTime=${startTime}`,
    );
    const data = await response.data;
    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.error("error: ", error);
    return res
      .status(500)
      .json({ message: "Fail", data: "Internal server error" });
  }
});

export default router;

import express, { Router } from "express";
import { ZodError } from "zod";
import { DatabaseError } from "pg";
import { pgPool } from "../store/db.js";
import { candleSchema } from "../schema/candleSchema.js";

const router: Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { asset, startTime, endTime } = candleSchema.parse(req.query);

    // should query db to get 1m candles for now. should change this to accomodate all the candles going ahead.

    const table = "candle_1m"; // should change when new candle timeframes are added.
    const query = `SELECT * FROM ${table} WHERE asset = $1 AND bucket <= $2 AND bucket >= $3;`;
    const qeuryResult = await pgPool.query(query, [asset, startTime, endTime]);

    return res.status(200).json({ message: "success", data: qeuryResult.rows });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    if (error instanceof DatabaseError) {
      return res.status(500).json({ message: "database error", error });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;

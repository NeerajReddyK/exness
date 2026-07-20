import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import tradeRouter from "./routes/trade.js";
import KlineRouter from "./routes/klines.js";
import priceRouter from "./routes/prices.js";
import tradeToDb from "./lib/tradeToDb.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use("/auth", authRouter);
app.use("/trade", tradeRouter);
app.use("/klines", KlineRouter);
app.use("/prices", priceRouter);

tradeToDb();

app.listen(3000, () => {
  console.log("listening on port 3000");
});

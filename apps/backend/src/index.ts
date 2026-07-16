import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import tradeRouter from "./routes/trade.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/trade", tradeRouter);

app.listen(3000, () => {
  console.log("listening on port 3000");
});

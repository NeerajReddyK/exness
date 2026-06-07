import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.js";
import assetRouter from "./routes/assets.js";
import candleRouter from "./routes/candles.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/assets", assetRouter);
app.use("/candles", candleRouter);

app.listen(PORT, () => {
  console.log("listening on PORT: ", PORT);
});

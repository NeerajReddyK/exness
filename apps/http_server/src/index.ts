import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log("listening on PORT: ", PORT);
});

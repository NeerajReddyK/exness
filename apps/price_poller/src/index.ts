import express from "express";
import "dotenv/config";
import axios from "axios";

const app = express();

app.use(express.json());

const api = process.env.POLL_API!;

app.get("/", (req, res) => {
  const data = axios.get(api);
  return res.status(200).json({ msg: "success" });
});

app.listen(3000, () => {
  console.log("log dotenv: ", process.env.POLL_API);
  console.log("Hello from 3000");
});

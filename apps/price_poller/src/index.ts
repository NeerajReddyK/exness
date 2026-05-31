import WebSocket from "ws";
import "dotenv/config";
import pg from "pg";

const wssEP = process.env.WSS_EP;
if (!wssEP) {
  console.error("undefined wss endpoint");
}

const ws = new WebSocket(`${wssEP}/ws`);

ws.on("error", (error) => console.log("error: ", error));

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (error, client) => {
  console.error("pg pool error: ", error);
  process.exit(-1);
});

ws.on("open", () => {
  console.log("connected");

  ws.send(
    JSON.stringify({
      method: "SUBSCRIBE",
      params: ["solusdt@ticker"],
      id: 1,
    }),
  );

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());
    if (parsedData.E) {
      const client = await pool.connect();
      await client.query(
        `INSERT INTO ticker(time, price, asset, volume) VALUES (to_timestamp(${parsedData.E} / 1000.0), ${parsedData.c}, '${parsedData.s}', ${parsedData.v})`,
      );
      client.release();
    }
  });

  ws.on("close", () => {
    pool.removeAllListeners();
  });
});

import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string(),
});

export const logInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const tradeSchema = z.object({
  token: z.string(),
  asset: z.string(),
  quantity: z.string(),
});

export const SYMBOL_MAP = {
  SOLUSDC: "SOL",
  ETHUSDC: "ETH",
  BTCUSDC: "BTC",
};

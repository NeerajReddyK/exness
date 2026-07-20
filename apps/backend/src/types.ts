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
  asset: z.enum(["SOL_USDC", "BTC_USDC", "ETH_USDC"]),
  quantity: z.string(),
});

export const getTrades = z.object({
  token: z.string(),
});

interface tradeMessage {
  type: "trade-buy" | "trade-sell";
  tradeId: string;
  userId: string;
  asset: "SOLUSDC" | "BTCUSDC" | "ETHUSDC";
  quantity: string;
}
export interface tradeRequestTypes {
  id: string;
  message: tradeMessage;
}

export const SYMBOL_MAP = {
  SOLUSDC: "SOL",
  ETHUSDC: "ETH",
  BTCUSDC: "BTC",
} as const;

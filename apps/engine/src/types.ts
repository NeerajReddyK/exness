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

interface priceUpdate {
  type: "price-update";
  asset: "SOLUSDC" | "BTCUSDC" | "ETHUSDC";
  bid: string;
  ask: string;
}
export interface priceUpdateTypes {
  id: string;
  message: priceUpdate;
}

export const SYMBOL_MAP = {
  SOLUSDC: "SOL",
  ETHUSDC: "ETH",
  BTCUSDC: "BTC",
} as const;

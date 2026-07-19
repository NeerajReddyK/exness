interface tradeMessage {
  type: "trade-buy" | "trade-sell";
  tradeId: string;
  userId: string;
  asset: "SOL_USDC" | "BTC_USDC" | "ETH_USDC";
  quantity: string;
}
export interface tradeRequestTypes {
  id: string;
  message: tradeMessage;
}

interface priceUpdate {
  type: "price-update";
  SOL_ask: string;
  SOL_bid: string;
  BTC_ask: string;
  BTC_bid: string;
  ETH_ask: string;
  ETH_bid: string;
}
export interface priceUpdateTypes {
  id: string;
  message: priceUpdate;
}

export const SYMBOL_MAP = {
  SOL_USDC: "SOL",
  BTC_USDC: "BTC",
  ETH_USDC: "ETH",
} as const;

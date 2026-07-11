interface tradeMessage {
  type: "trade-buy" | "trade-sell";
  tradeId: string;
  userId: string;
  asset: "SOLUSDC" | "BTCUSD" | "ETHUSD";
  quantity: string;
}
export interface tradeRequestTypes {
  id: string;
  message: tradeMessage;
}

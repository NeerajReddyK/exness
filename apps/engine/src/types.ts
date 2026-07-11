interface tradeMessage {
  type: "trade-request";
  tradeId: string;
  userId: string;
  asset: "SOLUSDC" | "BTCUSD" | "ETHUSD";
  bid: string;
}
export interface tradeRequestTypes {
  id: string;
  message: tradeMessage;
}

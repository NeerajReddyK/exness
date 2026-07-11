type asset = "SOL" | "BTC" | "ETH";

interface assetValues {
  bid: number;
  ask: number;
}

export const PRICESTORE: Record<asset, assetValues> = {
  SOL: { bid: 0, ask: 0 },
  BTC: { bid: 0, ask: 0 },
  ETH: { bid: 0, ask: 0 },
};

interface balanceType {
  usd: number;
  asset: Record<asset, number>;
}

export const BALANCES: Record<string, balanceType> = {};

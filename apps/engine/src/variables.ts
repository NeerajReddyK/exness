type asset = "SOL_USDC" | "BTC_USDC" | "ETH_USDC";

interface assetValues {
  bid: number;
  ask: number;
}

export const PRICESTORE: Record<asset, assetValues> = {
  SOL_USDC: { bid: 0, ask: 0 },
  BTC_USDC: { bid: 0, ask: 0 },
  ETH_USDC: { bid: 0, ask: 0 },
};

interface balanceType {
  usd: number;
  asset: Record<asset, number>;
}

export const BALANCES: Record<string, balanceType> = {};

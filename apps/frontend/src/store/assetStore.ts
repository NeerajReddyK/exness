import { create } from "zustand";

export type assetType = "SOL_USDC" | "BTC_USDC" | "ETH_USDC";

const assetStore = (set: any) => ({
  SOL_USDC: { ask: 0, bid: 0 },
  BTC_USDC: { ask: 0, bid: 0 },
  ETH_USDC: { ask: 0, bid: 0 },
  selectedAsset: "SOL_USDC",
  setSelectedAsset: (asset: assetType) => {
    set(() => ({
      selectedAsset: asset,
    }));
  },
  udpatePrice: (asset: assetType, price: { bid: number; ask: number }) => {
    if (asset === "SOL_USDC") {
      set(() => ({
        SOL_USDC: { ask: price.ask, bid: price.bid },
      }));
    } else if (asset === "BTC_USDC") {
      set(() => ({
        BTC_USDC: price,
      }));
    } else if (asset === "ETH_USDC") {
      set(() => ({
        ETH_USDC: price,
      }));
    }
  },
});

const useAssetStore = create(assetStore);

export default useAssetStore;

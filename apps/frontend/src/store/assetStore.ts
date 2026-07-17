import { create } from "zustand";

export type assetType = "SOL_USDC" | "BTC_USDC" | "ETH_USDC";

const assetStore = (set: any) => ({
  SOL_USDC: 0,
  BTC_USDC: 0,
  ETH_USDC: 0,
  selectedAsset: "SOL_USDC",
  setSelectedAsset: (asset: assetType) => {
    set(() => ({
      selectedAsset: asset,
    }));
  },
  udpatePrice: (asset: assetType, price: number) => {
    if (asset === "SOL_USDC") {
      set(() => ({
        SOL_USDC: price,
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

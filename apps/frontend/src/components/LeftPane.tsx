import { useEffect } from "react";
import useAssetStore, { type assetType } from "../store/assetStore";
import { AssetPrice } from "./AssetPrice";

const backpackWs = import.meta.env.VITE_BACKPACK_WS;
export const LeftPane = () => {
  const updatePrice = useAssetStore((state) => state.udpatePrice);
  const setSelectedAsset = useAssetStore((state) => state.setSelectedAsset);
  const subscribe = {
    id: 1,
    method: "SUBSCRIBE",
    params: [
      "bookTicker.SOL_USDC",
      "bookTicker.BTC_USDC",
      "bookTicker.ETH_USDC",
    ],
  };
  useEffect(() => {
    const websocket = new WebSocket(backpackWs);
    websocket.onopen = () => {
      console.log("websocket open");
      websocket.send(JSON.stringify(subscribe));
    };

    websocket.onmessage = (message) => {
      const obj = JSON.parse(message.data.toString());
      if (obj.data.s === "SOL_USDC") {
        updatePrice("SOL_USDC", Number(obj.data.a));
      } else if (obj.data.s === "BTC_USDC") {
        updatePrice("BTC_USDC", Number(obj.data.a));
      } else if (obj.data.s === "ETH_USDC") {
        updatePrice("ETH_USDC", Number(obj.data.a));
      }
    };

    // clean-up
    return () => websocket.close();
  }, []);

  const handleClick = (asset: assetType) => {
    console.log("clicked: ", asset);
    console.log("state: ", useAssetStore.getState());
    setSelectedAsset(asset);
  };
  return (
    <div className="m-2">
      <h3 className="h-8 text-xl">ASSETS SUPPORTED</h3>
      <div className="headerandassets">
        <div className="flex flex-col items-start justify-center gap-4">
          <div
            onClick={() => handleClick("SOL_USDC")}
            className="cursor-pointer flex items-center justify-between w-full"
          >
            SOL_USDC
            <AssetPrice asset="SOL_USDC" />
          </div>
          <div
            onClick={() => handleClick("BTC_USDC")}
            className="cursor-pointer flex items-center justify-between w-full"
          >
            BTC_USDC
            <AssetPrice asset="BTC_USDC" />
          </div>
          <div
            onClick={() => handleClick("ETH_USDC")}
            className="cursor-pointer flex items-center justify-between w-full"
          >
            ETH_USDC
            <AssetPrice asset="ETH_USDC" />
          </div>
        </div>
      </div>
    </div>
  );
};

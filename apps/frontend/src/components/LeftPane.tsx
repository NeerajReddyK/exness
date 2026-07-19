import { useEffect } from "react";
import useAssetStore, { type assetType } from "../store/assetStore";
import { AssetPrice } from "./AssetPrice";
import axios from "axios";

const backpackWs = import.meta.env.VITE_BACKPACK_WS;
const beUrl = import.meta.env.VITE_BE_URL;
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
    const fetchData = async () => {
      try {
        const result = await axios.get(`${beUrl}/prices`);
        const data = result.data.data;
        updatePrice("SOL_USDC", { ask: data.SOL_ask, bid: data.SOL_bid });
        updatePrice("BTC_USDC", { ask: data.BTC_ask, bid: data.BTC_bid });
        updatePrice("ETH_USDC", { ask: data.ETH_ask, bid: data.ETH_bid });
      } catch (error) {
        console.log("error while fetching data from backend: ", error);
        return;
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const websocket = new WebSocket(backpackWs);
    websocket.onopen = () => {
      console.log("websocket open");
      websocket.send(JSON.stringify(subscribe));
    };

    websocket.onmessage = (message) => {
      const obj = JSON.parse(message.data.toString());
      if (obj.data.s === "SOL_USDC") {
        updatePrice("SOL_USDC", {
          ask: Number(obj.data.a),
          bid: Number(obj.data.b),
        });
      } else if (obj.data.s === "BTC_USDC") {
        updatePrice("BTC_USDC", {
          ask: Number(obj.data.a),
          bid: Number(obj.data.b),
        });
      } else if (obj.data.s === "ETH_USDC") {
        updatePrice("ETH_USDC", {
          ask: Number(obj.data.a),
          bid: Number(obj.data.b),
        });
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

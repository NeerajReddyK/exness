// should call GET /assets and populate all of them in the left pane

import { useEffect, useState } from "react";
import { Asset } from "./Asset";

const beUrl = import.meta.env.VITE_BEURL || "http://localhost:3000";
export const LeftPane = () => {
  const [assets, setAssets] = useState<
    [{ name: string; symbol: string; buyPrice: number; sellPrice: number }]
  >([{ name: "SOLANA", symbol: "SOL", buyPrice: 0, sellPrice: 0 }]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${beUrl}/assets`);
      const result = await response.json();
      if (result.assets) {
        setAssets(result.assets);
      }
      return;
    };
    fetchData();
  }, []);
  return (
    <div className="m-2">
      <div className="h-8">INSTRUMENTS</div>
      <div className="headerandassets">
        <div className="flex">
          <span className="flex-2">Symbol</span>
          <span className="flex-1">bid</span>
          <span className="flex-1">ask</span>
        </div>
        {assets.map(
          (asset: {
            name: string;
            symbol: string;
            buyPrice: number;
            sellPrice: number;
          }) => (
            <div key={asset.symbol} className="my-2 text-xl cursor-pointer">
              <Asset
                symbol={asset.symbol}
                bid={asset.buyPrice}
                ask={asset.sellPrice}
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

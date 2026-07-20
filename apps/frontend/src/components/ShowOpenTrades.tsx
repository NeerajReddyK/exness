import { useEffect } from "react";
import useAssetStore from "../store/assetStore";
import useTradesStore from "../store/tradesStore";

export const ShowOpenTrades = () => {
  const openTrades = useTradesStore((state) => state.openTrades);
  const solBid = useAssetStore((state) => state.SOL_USDC.bid);
  const btcBid = useAssetStore((state) => state.BTC_USDC.bid);
  const ethBid = useAssetStore((state) => state.ETH_USDC.bid);
  const fetchOpenTrades = useTradesStore((state) => state.fetchData);
  useEffect(() => {
    fetchOpenTrades();
  }, []);
  return (
    <div>
      <div>
        {openTrades.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            {" "}
            no open trades
          </div>
        )}
      </div>
      {openTrades.map((trade: any, id) => (
        <div key={id} className="flex gap-4">
          <div>{trade.asset}</div>
          <div>{trade.quantity}</div>
          <div>{trade.price}</div>
          <div>
            {trade.asset === "SOL_USDC" && (
              <div className="flex gap-4">
                <div>{solBid}</div>
                <div>{(trade.price - solBid).toPrecision(1)}</div>
              </div>
            )}
            {trade.asset === "BTC_USDC" && (
              <div className="flex gap-4">
                <div>{btcBid}</div>
                <div>{(trade.price - btcBid).toPrecision(1)}</div>
              </div>
            )}
            {trade.asset === "ETH_USDC" && (
              <div className="flex gap-4">
                <div>{ethBid}</div>
                <div>{(trade.price - ethBid).toPrecision(1)}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

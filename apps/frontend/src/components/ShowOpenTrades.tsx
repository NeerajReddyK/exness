import useAssetStore from "../store/assetStore";
import useTradesStore from "../store/tradesStore"

export const ShowOpenTrades = () => {
    const openTrades = useTradesStore((state) => state.openTrades);
    const solPrice = useAssetStore((state) => state.SOL_USDC);
    const btcPrice = useAssetStore((state) => state.BTC_USDC);
    const ethPrice = useAssetStore((state) => state.ETH_USDC);
    return (
        <div>
            {openTrades.map((trade: any, id) => (
                <div key={id} className="flex gap-4">
                    <div>
                        {trade.asset}
                    </div>
                    <div>
                        {trade.quantity}
                    </div>
                    <div>
                        {trade.price}
                    </div>
                    <div>
                        { trade.asset === "SOL_USDC" && 
                            <div className="flex gap-4">
                                <div>
                                    {solPrice}
                                </div>
                                <div>
                                    {(trade.price - solPrice).toPrecision(1)}
                                </div>
                            </div>
                        }
                        { trade.asset === "BTC_USDC" && 
                            <div className="flex gap-4">
                                <div>
                                    {btcPrice}
                                </div>
                                <div>
                                    {(trade.price - btcPrice).toPrecision(1)}
                                </div>
                            </div>
                        }
                        { trade.asset === "ETH_USDC" && 
                            <div className="flex gap-4">
                                <div>
                                    {ethPrice}
                                </div>
                                <div>
                                    {(trade.price - ethPrice).toPrecision(1)}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useUserStore from "../store/userStore";
import useTradesStore from "../store/tradesStore";
import useAssetStore from "../store/assetStore";

const beUrl = import.meta.env.VITE_BE_URL;
export const Buy = () => {
  const asset = useAssetStore((state) => state.selectedAsset);
  const [buyQuantity, setBuyQuantity] = useState<number>(0);
  const [sellQuantity, setSellQuantity] = useState<number>(0);
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();
  const setOpen = useTradesStore((state) => state.setOpen);
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, []);

  const handleBuySubmit = async () => {
    console.log("inside handleBuySubmit");
    const response = await axios.post(`${beUrl}/trade/buy`, {
      token,
      asset,
      quantity: `${buyQuantity}`,
    });

    // should also send to the database. should create a seperate stream for this.
    const data = response.data.data;
    const newTrade = {
      asset: data.requestedAsset,
      price: data.executedPrice,
      quantity: data.requestedQuantity,
      updatedBalance: data.updatedBalance,
    };
    setOpen(newTrade);

    console.log("updatedBalance: ", response.data);
  };

  const handleSellSubmit = async () => {
    const response = await axios.post(`${beUrl}/trade/sell`, {
      token,
      asset,
      quantity: `${sellQuantity}`,
    });
    console.log("udpatedBalance: ", response.data);
  };

  return (
    <div className="grid grid-rows-3 m-2 mt-5 gap-10">
      <div>
        <h3 className="flex items-center justify-center text-2xl mb-2">Buy</h3>
        <div className="flex flex-col gap-1">
          <label htmlFor="buy-quantity" className="text-xl">
            {asset}
          </label>
          <div className="flex items-center justify-between">
            quantity
            <input
              type="decimal"
              id="buy-quantity"
              className="max-w-16 text-right pr-2 py-1 border rounded-sm focus:outline-none"
              onChange={(e) => setBuyQuantity(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          onClick={handleBuySubmit}
          className="mt-2 bg-teal-600 py-2 rounded-lg w-full cursor-pointer font-semibold"
        >
          Submit
        </button>
      </div>
      <div>
        <h3 className="flex items-center justify-center text-2xl mb-2">Sell</h3>
        <div className="flex flex-col gap-1">
          <label htmlFor="sell-quantity" className="text-xl">
            {asset}
          </label>
          <div className="flex items-center justify-between">
            quantity
            <input
              type="decimal"
              id="sell-quantity"
              className="max-w-16 text-right pr-2 py-1 border rounded-sm focus:outline-none"
              onChange={(e) => setSellQuantity(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          onClick={handleSellSubmit}
          className="mt-2 bg-teal-600 py-2 rounded-lg w-full cursor-pointer font-semibold"
        >
          Submit
        </button>
      </div>
      <div>third part</div>
    </div>
  );
};

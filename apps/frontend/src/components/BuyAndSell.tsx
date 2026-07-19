import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useUserStore from "../store/userStore";
import useTradesStore from "../store/tradesStore";

const beUrl = import.meta.env.VITE_BE_URL;
export const Buy = () => {
  const [asset, setAsset] = useState<"SOL_USDC" | "BTC_USDC" | "ETH_USDC">(
    "SOL_USDC",
  );
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
    <div className="flex items-center justify-center flex-col m-2 gap-4">
      <div>
        <h3 className="flex items-center justify-center text-2xl">Buy</h3>
        <div className="flex flex-col gap-3">
          {/* SOL is hardcoded. 
                     it should change based on the chart displayed. 
                     should change when state management library is added. */}
          <label htmlFor="quantity" className="text-xl">
            SOLUSDC
          </label>
          <input
            type="number"
            placeholder="quantity"
            id="quantity"
            className="border"
            onChange={(e) => setBuyQuantity(Number(e.target.value))}
          />
        </div>
        <button
          onClick={handleBuySubmit}
          className="mt-2 bg-blue-500 py-2 rounded-lg w-full cursor-pointer"
        >
          Submit
        </button>
      </div>
      <div>
        <h3 className="flex items-center justify-center text-2xl">Sell</h3>
        <div className="flex flex-col gap-3">
          {/* SOL is hardcoded. 
                     it should change based on the chart displayed. 
                     should change when state management library is added. */}
          <label htmlFor="quantity" className="text-xl">
            SOLUSDC
          </label>
          <input
            type="number"
            placeholder="quantity"
            id="quantity"
            className="border"
            onChange={(e) => setSellQuantity(Number(e.target.value))}
          />
        </div>
        <button
          onClick={handleSellSubmit}
          className="mt-2 bg-blue-500 py-2 rounded-lg w-full cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

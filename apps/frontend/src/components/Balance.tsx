import { useEffect } from "react";
import useUserStore from "../store/userStore";

export const Balance = () => {
  const balance = useUserStore((state) => state.balance);
  console.log("balance: ", balance);
  console.log("typeof balance: ", typeof balance);
  const parsedBalance = JSON.parse(balance!);
  // const setBalance = useUserStore((state) => state.setBalance);
  useEffect(() => {
    //create a route to get balance
  }, []);
  return (
    <div>
      <h3 className="text-xl">AVAILABLE BALANCE</h3>
      <div className="flex text-lg flex-col">
        <div className="flex items-center justify-between">
          <div>USD</div>
          <p className="bg-gray-300 rounded-sm text-black flex items-center justify-center py-0.5 px-4 mt-2 min-w-22.5">
            {Number(parsedBalance.usd).toFixed(1)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>SOL_USDC</div>
          <p className="bg-gray-300 rounded-sm text-black flex items-center justify-center py-0.5 px-4 mt-2 min-w-22.5">
            {parsedBalance.asset.SOL_USDC}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>BTC_USDC</div>
          <p className="bg-gray-300 rounded-sm text-black flex items-center justify-center py-0.5 px-4 mt-2 min-w-22.5">
            {parsedBalance.asset.BTC_USDC}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>ETH_USDC</div>
          <p className="bg-gray-300 rounded-sm text-black flex items-center justify-center py-0.5 px-4 mt-2 min-w-22.5">
            {parsedBalance.asset.ETH_USDC}
          </p>
        </div>
      </div>
    </div>
  );
};

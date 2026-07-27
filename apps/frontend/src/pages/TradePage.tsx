import { useEffect } from "react";
import { Buy } from "../components/BuyAndSell";
import { Chart } from "../components/Chart";
import { LeftPane } from "../components/LeftPane";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router";
import { OpenTrades } from "../components/OpenTrades";
import { NavBar } from "../components/NavBar";
import { Chart2 } from "../components/Chart2";

export const TradePage = () => {
  const navigate = useNavigate();
  const user = useUserStore.getState();
  useEffect(() => {
    const token = user.token;
    if (!token) {
      navigate("/login");
      return;
    }
  }, [useUserStore.getState()]);
  return (
    <div className="h-screen flex flex-col ">
      <div className="h-16 bg-componentBgColor">
        <NavBar />
      </div>

      <div className="flex-1 flex flex-row overflow-hidden gap-1 mt-1">
        <div className="w-64 bg-componentBgColor rounded-r-md">
          <LeftPane />
        </div>

        <div className="flex-1 flex flex-col gap-1 rounded-md ">
          <div className="flex-1 bg-componentBgColor rounded-lg">
            {/* <Chart /> */}
            <Chart2 />
          </div>
          <div className="h-48 bg-componentBgColor rounded-sm">
            <OpenTrades />
          </div>
        </div>

        <div className="w-56 bg-componentBgColor rounded-l-sm">
          <Buy />
        </div>
      </div>
      <div className="h-8 bg-componentBgColor mt-1 flex items-center justify-center">
        The backend is built to handle several thousand request per second with
        latency matching real systems
      </div>
    </div>
  );
};

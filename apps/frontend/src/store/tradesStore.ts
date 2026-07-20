import { create } from "zustand";
import { beUrl } from "../components/BuyAndSell";
import axios from "axios";
import useUserStore from "./userStore";

const tradesStore = (set: any, get: any) => ({
  openTrades: [],
  closedTrades: [],
  fetchData: async () => {
    console.log("inside fetchData");
    const token = useUserStore.getState().token;
    const response = await axios.get(`${beUrl}/trade/trades`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const formattedData = response.data.data.map((trade: any) => ({
      asset: trade.asset,
      quantity: trade.quantity,
      price: trade.issuePrice,
    }));
    set({
      openTrades: formattedData,
    });
  },
  setClosed: (trade: any) => {
    set(() => ({
      closedTrades: [...get().closedTrades, trade],
    }));
  },
  setOpen: (trade: any) => {
    set(() => ({
      openTrades: [...get().openTrades, trade],
    }));
  },
});

const useTradesStore = create(tradesStore);

export default useTradesStore;

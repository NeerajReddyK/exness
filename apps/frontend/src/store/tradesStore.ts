import { create } from "zustand";

const tradesStore = (set: any, get: any) => ({
  openTrades: [],
  closedTrades: [],
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

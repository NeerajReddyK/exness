import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
  token: string;
  balance: string;
}
const userStore = (set: any) => ({
  name: null,
  email: null,
  token: null,
  balance: null,
  addUser: (user: User) => {
    set(() => ({
      name: user.name,
      email: user.email,
      token: user.token,
      balance: user.balance,
    }));
  },
  setBalance: (balance: string) => {
    set(() => ({
      balance,
    }));
  },
});

const useUserStore = create(
  persist(userStore, {
    name: "user",
    storage: createJSONStorage(() => localStorage),
  }),
);
export default useUserStore;

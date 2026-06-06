export const USERS: Record<
  string,
  {
    name: string;
    email: string;
    password: string;
    balance: { usd_balance: number };
    assets: Record<string, number>;
  }
> = {};

export const PRICESTORE: Record<string, { bid: number; ask: number }> = {};

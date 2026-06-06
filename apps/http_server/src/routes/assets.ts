// /get route should give current bid and ask price of all the assets available.

import express, { Router } from "express";
import { PRICESTORE } from "../store/user.js";

const router: Router = express.Router();

const assets: { name: string; symbol: string; decimals: number }[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 4,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 4,
  },
  {
    name: "Solana",
    symbol: "SOL",
    decimals: 4,
  },
];

router.get("/", (req, res) => {
  const responseAsseets = assets.map((asset) => {
    const price = PRICESTORE[asset.symbol];
    if (!price) {
      return {
        name: asset.name,
        symbol: asset.symbol,
        buyPrice: 0,
        sellPrice: 0,
        decimals: 4,
      };
    }
    return {
      name: asset.name,
      symbol: asset.symbol,
      buyPrice: price.ask,
      sellPrice: price.bid,
      decimals: asset.symbol,
    };
  });

  return res.status(200).json({ assets: responseAsseets });
});

export default router;

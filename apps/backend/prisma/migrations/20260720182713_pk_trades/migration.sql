-- AlterTable
ALTER TABLE "Trades" ADD CONSTRAINT "Trades_pkey" PRIMARY KEY ("tradeId");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DEFAULT '{"usd":5000,"asset":{"SOL_USDC":0,"BTC_USDC":0,"ETH_USDC":0}}';

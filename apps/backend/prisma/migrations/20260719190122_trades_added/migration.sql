-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "AssetEnum" AS ENUM ('SOL_USDC', 'BTC_USDC', 'ETH_USDC');

-- CreateEnum
CREATE TYPE "TypeEnum" AS ENUM ('buy', 'sell');

-- CreateTable
CREATE TABLE "Trades" (
    "tradeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL,
    "asset" "AssetEnum" NOT NULL,
    "type" "TypeEnum" NOT NULL,
    "issuePrice" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "salePrice" DECIMAL(65,30),
    "isActive" BOOLEAN DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "Trades_tradeId_key" ON "Trades"("tradeId");

-- AddForeignKey
ALTER TABLE "Trades" ADD CONSTRAINT "Trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

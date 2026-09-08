/*
  Warnings:

  - You are about to drop the column `boostAmount` on the `Booster` table. All the data in the column will be lost.
  - You are about to drop the column `statName` on the `Booster` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booster" DROP COLUMN "boostAmount",
DROP COLUMN "statName";

-- CreateTable
CREATE TABLE "BoosterEffect" (
    "id" TEXT NOT NULL,
    "boosterId" TEXT NOT NULL,
    "statName" TEXT NOT NULL,
    "boostAmount" INTEGER NOT NULL,

    CONSTRAINT "BoosterEffect_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoosterEffect" ADD CONSTRAINT "BoosterEffect_boosterId_fkey" FOREIGN KEY ("boosterId") REFERENCES "Booster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

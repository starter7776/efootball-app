-- CreateTable
CREATE TABLE "Booster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "statName" TEXT NOT NULL,
    "boostAmount" INTEGER NOT NULL,
    "isConditional" BOOLEAN NOT NULL,
    "conditionDescription" TEXT,

    CONSTRAINT "Booster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerBooster" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "boosterId" TEXT NOT NULL,
    "slotNumber" INTEGER NOT NULL,

    CONSTRAINT "PlayerBooster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerBooster_playerId_slotNumber_key" ON "PlayerBooster"("playerId", "slotNumber");

-- AddForeignKey
ALTER TABLE "PlayerBooster" ADD CONSTRAINT "PlayerBooster_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBooster" ADD CONSTRAINT "PlayerBooster_boosterId_fkey" FOREIGN KEY ("boosterId") REFERENCES "Booster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "currentLevel" INTEGER,
ADD COLUMN     "currentPoints" INTEGER,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "levelCap" INTEGER,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "preferredFoot" TEXT,
ADD COLUMN     "weakFootAccuracy" INTEGER,
ADD COLUMN     "weakFootFrequency" INTEGER,
ADD COLUMN     "weight" INTEGER;

-- CreateTable
CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "offensiveAwareness" INTEGER,
    "ballControl" INTEGER,
    "dribbling" INTEGER,
    "tightPossession" INTEGER,
    "lowPass" INTEGER,
    "loftedPass" INTEGER,
    "finishing" INTEGER,
    "heading" INTEGER,
    "setPieceTaking" INTEGER,
    "curl" INTEGER,
    "defensiveAwareness" INTEGER,
    "defensiveEngagement" INTEGER,
    "ballWinning" INTEGER,
    "aggressiveness" INTEGER,
    "goalkeeping" INTEGER,
    "catching" INTEGER,
    "clearing" INTEGER,
    "collapsing" INTEGER,
    "deflecting" INTEGER,
    "speed" INTEGER,
    "acceleration" INTEGER,
    "kickingPower" INTEGER,
    "jump" INTEGER,
    "physicalContact" INTEGER,
    "bodyControl" INTEGER,
    "stamina" INTEGER,

    CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

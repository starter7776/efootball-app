-- CreateTable
CREATE TABLE "TrainingLog" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "simulationName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "allocatedPoints" JSONB NOT NULL,
    "resultingStats" JSONB NOT NULL,
    "notes" TEXT,

    CONSTRAINT "TrainingLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingLog" ADD CONSTRAINT "TrainingLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

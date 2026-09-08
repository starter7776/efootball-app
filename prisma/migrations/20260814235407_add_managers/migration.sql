-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "managerId" TEXT;

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adequacyValue" INTEGER NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerEffect" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "statName" TEXT NOT NULL,

    CONSTRAINT "ManagerEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerThreshold" (
    "id" TEXT NOT NULL,
    "adequacyValue" INTEGER NOT NULL,
    "lowMax" INTEGER NOT NULL,
    "midMax" INTEGER NOT NULL,

    CONSTRAINT "ManagerThreshold_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagerThreshold_adequacyValue_key" ON "ManagerThreshold"("adequacyValue");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerEffect" ADD CONSTRAINT "ManagerEffect_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `AccessTocken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTocken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_AccessTocken_key";

-- DropIndex
DROP INDEX "User_refreshTocken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "AccessTocken",
DROP COLUMN "refreshTocken",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "refreshToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_accessToken_key" ON "User"("accessToken");

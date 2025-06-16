/*
  Warnings:

  - A unique constraint covering the columns `[refreshTocken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[AccessTocken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_login_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshTocken_key" ON "User"("refreshTocken");

-- CreateIndex
CREATE UNIQUE INDEX "User_AccessTocken_key" ON "User"("AccessTocken");

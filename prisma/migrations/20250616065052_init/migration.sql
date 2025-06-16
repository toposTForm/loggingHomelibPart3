/*
  Warnings:

  - Added the required column `refresTockenLifeTime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refresTockenLifeTime",
ADD COLUMN     "refresTockenLifeTime" TIMESTAMP(3) NOT NULL;

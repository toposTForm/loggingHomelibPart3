/*
  Warnings:

  - The primary key for the `Favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Favorites` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_id_fkey";

-- AlterTable
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_pkey",
ADD COLUMN     "usersid" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_usersid_fkey" FOREIGN KEY ("usersid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

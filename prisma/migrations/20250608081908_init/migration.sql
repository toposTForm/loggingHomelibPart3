/*
  Warnings:

  - You are about to drop the `_AlbumToFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtistToFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavoritesToTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavoritesToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AlbumToFavorites" DROP CONSTRAINT "_AlbumToFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumToFavorites" DROP CONSTRAINT "_AlbumToFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToFavorites" DROP CONSTRAINT "_ArtistToFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToFavorites" DROP CONSTRAINT "_ArtistToFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesToTrack" DROP CONSTRAINT "_FavoritesToTrack_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesToTrack" DROP CONSTRAINT "_FavoritesToTrack_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesToUser" DROP CONSTRAINT "_FavoritesToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesToUser" DROP CONSTRAINT "_FavoritesToUser_B_fkey";

-- AlterTable
ALTER TABLE "Favorites" ADD COLUMN     "albumsid" TEXT,
ADD COLUMN     "artistsid" TEXT,
ADD COLUMN     "tracksid" TEXT;

-- DropTable
DROP TABLE "_AlbumToFavorites";

-- DropTable
DROP TABLE "_ArtistToFavorites";

-- DropTable
DROP TABLE "_FavoritesToTrack";

-- DropTable
DROP TABLE "_FavoritesToUser";

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_artistsid_fkey" FOREIGN KEY ("artistsid") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_albumsid_fkey" FOREIGN KEY ("albumsid") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_tracksid_fkey" FOREIGN KEY ("tracksid") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

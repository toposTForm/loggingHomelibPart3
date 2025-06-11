/*
  Warnings:

  - A unique constraint covering the columns `[artistsid]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[albumsid]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tracksid]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorites_artistsid_key" ON "Favorites"("artistsid");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_albumsid_key" ON "Favorites"("albumsid");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_tracksid_key" ON "Favorites"("tracksid");

import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, FavoritesService],
})
export class AlbumsModule {}

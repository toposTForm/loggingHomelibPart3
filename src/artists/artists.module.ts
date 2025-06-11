import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, FavoritesService],
})
export class ArtistsModule {}

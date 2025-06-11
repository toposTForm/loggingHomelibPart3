import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, FavoritesService],
})
export class TracksModule {}

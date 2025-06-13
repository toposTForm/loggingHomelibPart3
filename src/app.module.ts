import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { LoggerModule } from './logger/logger.module';
import { NestModule } from '@nestjs/common';
// import { LoggerMiddleware } from './logger/logger.service';
import { MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    LoggerModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{
  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}

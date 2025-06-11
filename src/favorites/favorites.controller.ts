import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  HttpCode,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService, STATUS } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { validate } from 'uuid';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';

@Controller('/favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/track/:id')
  async addTrack(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer = await this.favoritesService.addTrack(id);
    if (serviceAnswer == STATUS.OBJECTONERROR) {
      throw new UnprocessableEntityException(
        `track with id: ${id} does not exist!`,
      );
    }
  }

  @Post('/album/:id')
  async addAlbum(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer = await this.favoritesService.addAlbum(id);
    if (serviceAnswer == STATUS.OBJECTONERROR) {
      throw new UnprocessableEntityException(
        `album with id: ${id} does not exist!`,
      );
    }
  }

  @Post('/artist/:id')
  async addArtist(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer = await this.favoritesService.addArtist(id);
    if (serviceAnswer == STATUS.OBJECTONERROR) {
      throw new UnprocessableEntityException(
        `artist with id: ${id} does not exist!`,
      );
    }
  }

  @Get()
  async findAll() {
    return this.favoritesService.findAll();
  }

  @Delete('/track/:id')
  @HttpCode(204)
  async removeFavTrack(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown =
      await this.favoritesService.removeFavTrack(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`track with id ${id} no found!`);
    }
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  async removeFavArtist(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown =
     await this.favoritesService.removeFavArtist(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`artist with id ${id} no found!`);
    }
  }

  @Delete('/album/:id')
  @HttpCode(204)
  async removeFavAlbum(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown =
      await this.favoritesService.removeFavAlbum(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`album with id ${id} no found!`);
    }
  }
}

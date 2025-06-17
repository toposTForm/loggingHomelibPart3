import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  BadRequestException,
  NotFoundException,
  Put,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistsService, STATUS } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';
import { LoggingInterceptor } from 'src/logger/log.interceprot';

@Controller('/artist')
@UseInterceptors(LoggingInterceptor)
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    if (
      createArtistDto.name !== undefined &&
      createArtistDto.grammy !== undefined &&
      createArtistDto.name !== null
    ) {
      if (
        !(createArtistDto.name.length > 0) ||
        typeof createArtistDto.grammy !== 'boolean'
      ) {
        throw new BadRequestException(`body does not contain required fields!`);
      }
      return await this.artistsService.create(createArtistDto);
    } else {
      throw new BadRequestException(`body does not contain required fields!`);
    }
  }

  @Get()
  async findAll() {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    const data: string | unknown = await this.artistsService.findOne(id);
    if (data == STATUS.NOTFOUND) {
      throw new NotFoundException(`artist with id ${id} no found!`);
    } else {
      return data;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateArtistDto: UpdateArtistDto,
  ) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    const serviceAnswer: STATUS | unknown = await this.artistsService.update(
      id,
      UpdateArtistDto,
    );
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`Artist with id ${id} no found!`);
    } else if ((serviceAnswer as STATUS) == STATUS.WRONGDTO) {
      throw new ForbiddenException(`dto is wrong!`);
    } else if (serviceAnswer == STATUS.BADREQUEST) {
      throw new BadRequestException(`invalid dto!`);
    } else {
      return serviceAnswer;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown = await this.artistsService.remove(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`track with id ${id} no found!`);
    }
    serviceAnswer = await this.favoritesService.removeFavArtist(id);
  }
}

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
} from '@nestjs/common';
import { AlbumsService, STATUS } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';
// private readonly favoritesService: FavoritesService
@Controller('/album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async create(@Body() CreateAlbumDto: CreateAlbumDto) {
    if (CreateAlbumDto.name !== undefined && CreateAlbumDto.name !== null) {
      if (
        !(CreateAlbumDto.name.length > 0) ||
        typeof CreateAlbumDto.year !== 'number'
      ) {
        throw new BadRequestException(`body does not contain required fields!`);
      }
      return await this.albumsService.create(CreateAlbumDto);
    } else {
      throw new BadRequestException(`body does not contain required fields!`);
    }
  }

  @Get()
  async findAll() {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let data: string | unknown = await this.albumsService.findOne(id);
    if (data == STATUS.NOTFOUND) {
      throw new NotFoundException(`artist with id ${id} no found!`);
    } else {
      return data;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() UpdateAlbumDto: UpdateAlbumDto) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown = await this.albumsService.update(
      id,
      UpdateAlbumDto,
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
    let serviceAnswer: STATUS | unknown = await this.albumsService.remove(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`track with id ${id} no found!`);
    }
    serviceAnswer = this.favoritesService.removeFavAlbum(id);
  }
}

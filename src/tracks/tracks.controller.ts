import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Put,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { TracksService, STATUS } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';

@Controller('/track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    if (
      createTrackDto.name !== undefined &&
      createTrackDto.duration !== undefined &&
      typeof createTrackDto.artistId !== 'undefined' &&
      typeof createTrackDto.albumId !== 'undefined'
    ) {
      if (
        !(createTrackDto.name.length > 0 || createTrackDto.duration) ||
        !(createTrackDto.name.length > 0)
      ) {
        throw new BadRequestException(`body does not contain required fields!`);
      }
      let track = await this.tracksService.create(createTrackDto);
      return track;
    } else {
      throw new BadRequestException(`body does not contain required fields!`);
    }
  }

  @Get()
  async findAll() {
    return await this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let data: string | unknown = await this.tracksService.findOne(id);
    if (data == STATUS.NOTFOUND) {
      throw new NotFoundException(`track with id ${id} no found!`);
    } else {
      return data;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() UpdateTrackDto: UpdateTrackDto) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown = await this.tracksService.update(
      id,
      UpdateTrackDto,
    );
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`track with id ${id} no found!`);
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
    let serviceAnswer: STATUS | unknown = await this.tracksService.remove(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`track with id ${id} no found!`);
    }
    serviceAnswer = await this.favoritesService.removeFavTrack(id);
  }
}

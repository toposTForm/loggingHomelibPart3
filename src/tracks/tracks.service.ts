import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';
import { prisma } from 'prisma/seed';
import { CustomLogger } from 'src/logger/logger.service';


export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
}

@Injectable()
export class TracksService {
  constructor(private customLogger: CustomLogger) {
    this.customLogger.log('req')
    this.customLogger.log('res')
  }

  async create(CreateTrackDto: CreateTrackDto) {
    const id = randomUUID();
    CreateTrackDto.id = id;
    await prisma.track.create({
      data: {
        id: id,
        name: CreateTrackDto.name,
        albumId: CreateTrackDto.albumId,
        artistId: CreateTrackDto.artistId,
        duration: Number(CreateTrackDto.duration),
      },
    });
    const track = await prisma.track.findUnique({ where: { id: id } });
    this.customLogger.log(`new track added!`);
    console.log(`new track added!`);
    return track;
  }

  async findAll() {
    // this.customLogger.log(`return all tracks`)
    console.log(`This action returns all tracks`);
    const tracks = await prisma.track.findMany();
    return tracks;
  }

  async findOne(id: string) {
    const track = await prisma.track.findUnique({ where: { id: id } });
    if (track == undefined) {
      return STATUS.NOTFOUND;
    }
    console.log(`This action returns a #${id} track`);
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const name = updateTrackDto.name;
    const artistId = updateTrackDto.artistId;
    const albumId = updateTrackDto.albumId;
    const duration = updateTrackDto.duration;
    if (name == undefined || duration == undefined) return STATUS.BADREQUEST;
    const track = await prisma.track.findUnique({ where: { id: id } });
    if (track == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.track.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        artistId: artistId,
        albumId: albumId,
        duration: duration,
      },
    });
    return `Track #${id} updated`;
  }

  async remove(id: string) {
    const trackIdex = await prisma.track.findUnique({ where: { id: id } });
    if (trackIdex == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.track.delete({ where: { id: id } });
    console.log(`This action removes a #${id} track`);
    return STATUS.DELETED;
  }
}

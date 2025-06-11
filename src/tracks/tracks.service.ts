import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';
import { prisma } from 'prisma/seed';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
}

@Injectable()
export class TracksService {
  async create(CreateTrackDto: CreateTrackDto) {
    let id = randomUUID();
    CreateTrackDto.id = id;
    await prisma.track.create({
      data: {
        id: id,
        name: CreateTrackDto.name,
        albumId: CreateTrackDto.albumId,
        artistId: CreateTrackDto.artistId,
        duration: Number(CreateTrackDto.duration)
      }
    });
    let track = await prisma.track.findUnique({where: {id: id}});
    console.log(`new track added!`);
    return track;
  }

  async findAll() {
    console.log(`This action returns all tracks`);
    let tracks = await prisma.track.findMany();
    return tracks;
  }

  async findOne(id: string) {
    let track = await prisma.track.findUnique({where: {id: id}});
    if (track == undefined) {
      return STATUS.NOTFOUND;
    }
    console.log(`This action returns a #${id} track`);
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    let name = updateTrackDto.name;
    let artistId = updateTrackDto.artistId;
    let albumId = updateTrackDto.albumId;
    let duration = updateTrackDto.duration;
    if (name == undefined || duration == undefined) return STATUS.BADREQUEST;
    let track = await prisma.track.findUnique({where: {id: id}});
    if (track == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.track.update({
      where: {
        id: id
      },
      data: {
        name: name,
        artistId: artistId,
        albumId: albumId,
        duration: duration
      }
    })
    return `Track #${id} updated`;
  }

  async remove(id: string) {
    let trackIdex = await prisma.track.findUnique({where: {id: id}})
    if (trackIdex == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.track.delete({where: {id: id}});
    console.log(`This action removes a #${id} track`);
    return STATUS.DELETED;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'crypto';
import { Album } from './entities/album.entity';
import { validate } from 'uuid';
import { Track } from 'src/tracks/entities/track.entity';
import { prisma } from 'prisma/seed';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
}

@Injectable()
export class AlbumsService {
  async create(CreateAlbumDto: CreateAlbumDto) {
    let id = randomUUID();
    CreateAlbumDto.id = id;
    await prisma.album.create({
      data: {
        id: id,
        name: CreateAlbumDto.name,
        year: CreateAlbumDto.year,
        artistId: CreateAlbumDto.artistId
      }
    })
    console.log(`new album added!`);
    const album = await prisma.album.findUnique({where: {id: id}});
    return album;
  }

  async findAll() {
    console.log(`This action returns all albums`);
    return await prisma.album.findMany();
  }

  async findOne(id: string) {
    let album = await prisma.album.findUnique({where: {id: id}});
    if (album == undefined) {
      return STATUS.NOTFOUND;
    }
    console.log(`This action returns a #${id} album`);
    return album;
  }

  async update(id: string, UpdateAlbumDto: UpdateAlbumDto) {
    if (UpdateAlbumDto.artistId !== null) {
      if (!validate(UpdateAlbumDto.artistId)) return STATUS.BADREQUEST;
    }
    let name = UpdateAlbumDto.name;
    let artistId = UpdateAlbumDto.artistId;
    let year = UpdateAlbumDto.year;
    if (name == undefined || year == undefined || typeof name == 'number')
      return STATUS.BADREQUEST;
    let album = await prisma.album.findUnique({where: {id: id}});
    if (album == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.album.update({
      where: {
        id: id
      },
      data: {
        name: name,
        year: year,
        artistId: artistId
      }
    });
    return `Album #${id} updated`;
  }

  async remove(id: string) {
    let album =  await prisma.album.findUnique({where: {id: id}});
    if (album == undefined) {
      return STATUS.NOTFOUND;
    }
    let referTracks = await prisma.track.findMany({where: {albumId: id}});
    if (referTracks){
      await prisma.track.updateMany({
        where: {
          albumId: id
        },
        data: {
          albumId: null
        }
      });
    };
    await prisma.album.delete({where: {id: id}});
    console.log(`This action removes a #${id} album`);
    return STATUS.DELETED;
  }
}

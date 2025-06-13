import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';
import { prisma } from 'prisma/seed';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
}

@Injectable()
export class ArtistsService {
  async create(createArtistDto: CreateArtistDto) {
    const id = randomUUID();
    createArtistDto.id = id;
    await prisma.artist.create({
      data: {
        id: id,
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
    const artist = await prisma.artist.findUnique({ where: { id: id } });
    console.log(`new artist added!`);
    return artist;
  }

  async findAll() {
    console.log(`This action returns all artists`);
    return await prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await prisma.artist.findUnique({ where: { id: id } });
    if (artist == undefined) {
      return STATUS.NOTFOUND;
    }
    console.log(`This action returns a #${id} artist`);
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const name = updateArtistDto.name;
    const grammy = updateArtistDto.grammy;
    if (name == undefined || grammy == undefined || typeof name == 'number')
      return STATUS.BADREQUEST;
    const artist = await prisma.artist.findUnique({ where: { id: id } });
    if (artist == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.artist.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        grammy: grammy,
      },
    });
    return `Artist #${id} updated`;
  }

  async remove(id: string) {
    const artistIdex = await prisma.artist.findUnique({ where: { id: id } });
    if (artistIdex == undefined) {
      return STATUS.NOTFOUND;
    }
    const referTracks = await prisma.track.findMany({
      where: { artistId: id },
    });
    if (referTracks) {
      await prisma.track.updateMany({
        where: {
          artistId: id,
        },
        data: {
          artistId: null,
        },
      });
    }
    const referAlbums = await prisma.album.findMany({
      where: { artistId: id },
    });
    if (referAlbums) {
      await prisma.album.updateMany({
        where: {
          artistId: id,
        },
        data: {
          artistId: null,
        },
      });
    }
    await prisma.artist.delete({ where: { id: id } });
    console.log(`This action removes a #${id} artist`);
    return STATUS.DELETED;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { randomUUID } from 'crypto';
import { validate } from 'uuid';
import { Favorite } from './entities/favorite.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { Artist } from 'src/artists/entities/artist.entity';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { CreateAlbumDto } from 'src/albums/dto/create-album.dto';
import { Album } from 'src/albums/entities/album.entity';
import { prisma } from 'prisma/seed';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
  OBJECTONERROR = 422,
}

@Injectable()
export class FavoritesService {
  async addTrack(id: string) {
    let track = await prisma.track.findUnique({where: {id: id}});
    if (track == undefined) {
      return STATUS.OBJECTONERROR;
    }
    await prisma.favorites.create({
      data: {
        tracksid: track.id
       }
    })
    console.log(`new favorite track added! ${JSON.stringify(track)}`);
    return track;
  }

  async addArtist(id: string) {
    let artist = await prisma.artist.findUnique({where: {id: id}});
    if (artist == undefined) {
      return STATUS.OBJECTONERROR;
    }
    await prisma.favorites.create({
      data: {
        artistsid: artist.id,
       }
    })
    console.log(`new favorite artist added! ${JSON.stringify(artist)}`);
    return artist;
  }

  async addAlbum(id: string) {
    let album = await prisma.album.findUnique({where: {id: id}});
    if (album == undefined) {
      return STATUS.OBJECTONERROR;
    }
     await prisma.favorites.create({
      data: {
        albumsid: album.id,
       }
    })
    console.log(`new favorite album added! ${JSON.stringify(album)}`);
    return album;
  }

  async findAll() {
    console.log(`This action returns all favorites`);
    let favTracks = await prisma.favorites.findMany({
      where: {
        tracks: {
          isNot: null
        }
      },
      include: {
        tracks: {
          select: {
            name: true,
            id: true,
            duration: true,
            artist: true,
            artistId: true,
            albumId: true
          }
        }
      },
      omit: {
        albumsid: true,
        artistsid: true,
        usersid: true
      }
    });
    let tracks = favTracks.map(track => ({
      id: track.tracks.id,
      name: track.tracks.name,
      artistId: track.tracks.artistId,
      albumId: track.tracks.albumId,
      duration: track.tracks.duration
    }));
    let favArtists = await prisma.favorites.findMany({
      where: {
        artists: {
          isNot: null
        }
      },
      include: {
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true
          }
        }
      },
      omit: {
        albumsid: true,
        tracksid: true,
        usersid: true
      }
    });
    let artists = favArtists.map(artist => ({
      id: artist.artists.id,
      name: artist.artists.name,
      grammy: artist.artists.grammy
    }));
    let favAlbums= await prisma.favorites.findMany({
      where: {
        albums: {
          isNot: null
        }
      },
      include: {
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true
          }
        }
      },
      omit: {
        artistsid: true,
        tracksid: true,
        usersid: true
      }
    });
    let albums = favAlbums.map(album => ({
      id: album.albums.id,
      name: album.albums.name,
      year: album.albums.year,
      artistId: album.albums.artistId
    }));
    let bla = 0;
    return {
      artists: artists,
      albums: albums,
      tracks: tracks
    };
  }

  async removeFavTrack(id: string) {
    let track = await prisma.favorites.findUnique({
      where: {
        tracksid: id
      }
    });
    if (track == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.favorites.delete({where: {tracksid: id}});
    console.log(`This action removes a #${id} track from favorites`);
    return STATUS.DELETED;
  }

  async removeFavArtist(id: string) {
    let artist = await prisma.favorites.findUnique({
      where: {
        artistsid: id
      }
    });
    if (artist == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.favorites.delete({where: {artistsid: id}});
    console.log(`This action removes a #${id} artist from favorites`);
    return STATUS.DELETED;
  }

  async removeFavAlbum(id: string) {
     let album = await prisma.favorites.findUnique({
      where: {
        albumsid: id
      }
    });
    if (album == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.favorites.delete({where: {albumsid: id}});
    console.log(`This action removes a #${id} album from favorites`);
    return STATUS.DELETED;
  }
}

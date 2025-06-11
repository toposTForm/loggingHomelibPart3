import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { CreateAlbumDto } from 'src/albums/dto/create-album.dto';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';

export class Favorite {
  artist: CreateArtistDto; // favorite artists ids
  album: CreateAlbumDto; // favorite albums ids
  track: CreateTrackDto; // favorite tracks ids
  static usersDb: Array<Favorite> = [];
  static artists: Array<CreateArtistDto> = [];
  static albums: Array<CreateAlbumDto> = [];
  static tracks: Array<CreateTrackDto> = [];
  constructor(
    artist?: CreateArtistDto,
    album?: CreateAlbumDto,
    track?: CreateTrackDto,
  ) {
    if (artist) {
      this.artist = artist;
      Favorite.artists.push(artist);
    }
    if (album) {
      this.album = album;
      Favorite.albums.push(album);
    }
    if (track) {
      this.track = track;
      Favorite.tracks.push(track);
    }
  }
  static pushToDb(user: Favorite) {
    Favorite.usersDb.push(user);
  }
}

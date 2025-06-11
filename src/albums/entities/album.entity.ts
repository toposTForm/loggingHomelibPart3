import { CreateAlbumDto } from '../dto/create-album.dto';

export class Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
  static usersDb: Array<Album> = [];
  constructor(dto: CreateAlbumDto) {
    this.id = dto.id;
    this.name = dto.name;
    this.year = dto.year;
    this.artistId = dto.artistId;
    Album.pushToDb(this);
  }
  static pushToDb(user: Album) {
    Album.usersDb.push(user);
  }
}

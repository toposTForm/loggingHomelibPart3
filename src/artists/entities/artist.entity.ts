import { CreateArtistDto } from '../dto/create-artist.dto';

export class Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
  static usersDb: Array<Artist> = [];
  constructor(dto: CreateArtistDto) {
    this.id = dto.id;
    this.name = dto.name;
    this.grammy = dto.grammy;
    Artist.pushToDb(this);
  }
  static pushToDb(user: Artist) {
    Artist.usersDb.push(user);
  }
}

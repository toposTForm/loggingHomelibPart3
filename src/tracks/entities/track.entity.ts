import { CreateTrackDto } from '../dto/create-track.dto';

export class Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
  static usersDb: Array<Track> = [];
  constructor(dto: CreateTrackDto) {
    this.id = dto.id;
    this.name = dto.name;
    this.artistId = dto.artistId;
    this.albumId = dto.albumId;
    this.duration = dto.duration;
    Track.pushToDb(this);
  }
  static pushToDb(user: Track) {
    Track.usersDb.push(user);
  }
}

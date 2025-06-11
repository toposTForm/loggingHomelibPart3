import { CreateUserDto } from '../dto/create-user.dto';
import { UUID } from 'crypto';

export class User {
  id: UUID;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
  static usersDb: Array<User> = [];
  private dto: CreateUserDto;
  constructor(
    dto: CreateUserDto,
    id: UUID,
    version: number,
    createdAt: number,
    updatedAt: number,
  ) {
    this.dto = dto;
    this.id = id;
    this.login = dto.login;
    this.password = dto.password;
    this.version = version;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    User.pushToDb(this);
  }
  static pushToDb(user: User) {
    User.usersDb.push(user);
  }
}

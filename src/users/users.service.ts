import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { randomUUID, UUID } from 'crypto';
import { User } from './entities/user.entity';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
}

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    let genuuid = randomUUID();
    let version = 1.0;
    let createdAt = Date.now();
    let updatedAt = Date.now();
    const user = new User(
      createUserDto,
      genuuid,
      version,
      createdAt,
      updatedAt,
    );
    console.log('new user added!');
    let tempUser = {
      id: '',
      login: '',
      version: null,
      createdAt: null,
      updatedAt: null,
    };
    tempUser.id = user.id;
    tempUser.login = user.login;
    tempUser.version = user.version;
    tempUser.createdAt = user.createdAt;
    tempUser.updatedAt = user.updatedAt;
    return tempUser;
  }

  findAll() {
    console.log(`This action returns all users`);
    return User.usersDb;
  }

  findOne(id: string) {
    let user = User.usersDb.find((user) => user.id == id);
    if (user == undefined) {
      return STATUS.NOTFOUND;
    }
    console.log(`This action returns a #${id} user`);
    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    let newPassword = updatePasswordDto.newPassword;
    let oldPassword = updatePasswordDto.oldPassword;
    if (newPassword == undefined || oldPassword == undefined)
      return STATUS.BADREQUEST;
    let user = User.usersDb.find((user) => user.id == id);
    if (user == undefined) {
      return STATUS.NOTFOUND;
    } else if (user.password !== oldPassword) return STATUS.WRONGDTO;
    user.version += 1;
    user.password = newPassword;
    user.updatedAt = Date.now();
    return `Password of #${id} user updated`;
  }

  remove(id: string) {
    let userIdex = User.usersDb.findIndex((user) => user.id == id);
    if (userIdex == -1) {
      return STATUS.NOTFOUND;
    }
    User.usersDb.splice(userIdex, 1);
    console.log(`This action removes a #${id} user`);
    return STATUS.DELETED;
  }
}
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { randomUUID, UUID } from 'crypto';
import { User } from './entities/user.entity';
import { createUser } from 'prisma/seed';
import { prisma } from 'prisma/seed';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
}

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    let genuuid = randomUUID();
    let version = 1.0;
    let createdAt = Date.now();
    let updatedAt = Date.now();
    const typeuser = new User(
      createUserDto,
      genuuid,
      version,
      createdAt,
      updatedAt,
    );
    console.log('new user added!');
    let temp = await createUser(typeuser);
    let user = await prisma.user.findUnique({where: {id: genuuid}});
     return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt)
    };
  }

  async findAll() {
    console.log(`This action returns all users`);
    let allUsers = await prisma.user.findMany();
    let tempUser = allUsers.map(field => ({
      id: field.id,
      login: field.login,
      version: field.version,
      createdAt: Number(field.createdAt),
      updatedAt: Number(field.updatedAt)
    }))
    return tempUser;
  }

  async findOne(id: string) {
    let user = await prisma.user.findUnique({ where: {id: id}});
    if (user == undefined) {
      return STATUS.NOTFOUND;
    }
    console.log(`This action returns a #${id} user`);
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt)
    };
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    let newPassword = updatePasswordDto.newPassword;
    let oldPassword = updatePasswordDto.oldPassword;
    if (newPassword == undefined || oldPassword == undefined)
      return STATUS.BADREQUEST;
    let user = await prisma.user.findUnique({where: {id: id}})
    if (user == undefined) {
      return STATUS.NOTFOUND;
    } else if (user.password !== oldPassword) return STATUS.WRONGDTO;
    await prisma.user.update({
      where: {
        id: id
      },
      data: {
        password: newPassword,
        version: {
          increment: 1
        },
        updatedAt: Date.now()
      }
    })
    return `Password of #${id} user updated`;
  }

  async remove(id: string) {
    let user = await prisma.user.findUnique({where: {id: id}});
    if (user == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.user.delete({where: {id: id}});
    console.log(`This action removes a #${id} user`);
    return STATUS.DELETED;
  }
}

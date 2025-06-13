import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
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
    const id = randomUUID();
    await prisma.user.create({
      data: {
        id: id,
        login: createUserDto.login,
        password: createUserDto.password,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });
    const user = await prisma.user.findUnique({ where: { id: id } });
    let mappedUser = {
      id: user.id,
      login: user.login,
      password: '***********',
      createdAt: Number(Date.now()).toString(),
      updatedAt: Number(Date.now()).toString(),
    }
    console.log(`new user created!`);
    return mappedUser;
  }

  async findAll() {
    console.log(`This action returns all users`);
    const allUsers = await prisma.user.findMany();
    const tempUser = allUsers.map((field) => ({
      id: field.id,
      login: field.login,
      version: field.version,
      createdAt: Number(field.createdAt),
      updatedAt: Number(field.updatedAt),
    }));
    return tempUser;
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (user == undefined) {
      return STATUS.NOTFOUND;
    }
    console.log(`This action returns a #${id} user`);
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const newPassword = updatePasswordDto.newPassword;
    const oldPassword = updatePasswordDto.oldPassword;
    if (newPassword == undefined || oldPassword == undefined)
      return STATUS.BADREQUEST;
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (user == undefined) {
      return STATUS.NOTFOUND;
    } else if (user.password !== oldPassword) return STATUS.WRONGDTO;
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: newPassword,
        version: {
          increment: 1,
        },
        updatedAt: Date.now(),
      },
    });
    return `Password of #${id} user updated`;
  }

  async remove(id: string) {
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (user == undefined) {
      return STATUS.NOTFOUND;
    }
    await prisma.user.delete({ where: { id: id } });
    console.log(`This action removes a #${id} user`);
    return STATUS.DELETED;
  }
}

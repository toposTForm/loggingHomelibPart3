import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import { prisma } from 'prisma/seed';
import * as bcrypt from 'bcrypt'
import { AuthService } from 'src/auth/auth.service';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
}

// JwtModule.registerAsync({
//          imports: [ConfigModule],
//          inject: [ConfigService],
//          useFactory: async (configService: ConfigService) => ({
//            secret: configService.get<string>('JWT_SECRET'), // Load from .env
//            signOptions: { expiresIn: '1h' }, // Token expiration time
//          }),
//        }),

@Injectable() 
export class UsersService {
  constructor(private readonly authService: AuthService){}

  async create(createUserDto: CreateUserDto) {
    const id = randomUUID();
    let hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      await prisma.user.create({
        data: {
          id: id,
          login: createUserDto.login,
          password: hashedPassword,
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
    } catch (error) {
      return error
    }
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

  async update(updatePasswordDto: UpdatePasswordDto) {
    const newPassword = updatePasswordDto.password;
    
    if (newPassword == undefined)
      return STATUS.BADREQUEST;
    const user = await prisma.user.findUnique({ where: { login: updatePasswordDto.login } });
    let oldPassword = user.password;
    let checkPass = await bcrypt.compare(newPassword, user.password);
    const accessToken = await this.authService.generateToken(user.id, user.password);
    if (user == undefined) {
      return STATUS.NOTFOUND;
    } else if (!checkPass) return STATUS.WRONGDTO;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
        version: {
          increment: 1,
        },
        updatedAt: Date.now(),
      },
    });
    return `Password of #${user.login} user updated`;
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

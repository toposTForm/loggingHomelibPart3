import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-user.dto';
import { randomUUID } from 'crypto';
import { prisma } from 'prisma/seed';
import * as bcrypt from 'bcrypt'

  export enum STATUS {
      BADREQUEST = 400,
      NOTFOUND = 404,
      WRONGDTO = 403,
      DELETED = 204,
    }

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        // private readonly configService: ConfigService,
    ) {}
  
    async generateToken(userId: string, login: string, currentRefreshTokenExpiresAt?: Date): Promise<string> {
        const payload = { userId: userId, login: login };
        return await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: `${ Number(currentRefreshTokenExpiresAt) }`})
    }

    async generateRefreshToken(userId: string, login, currentRefreshTokenExpiresAt?: Date) {
        const newRefreshToken = this.jwtService.signAsync(
            { userId: userId, login: login },
            { secret: process.env.JWT_SECRET, expiresIn: `${Number(currentRefreshTokenExpiresAt)}` },
        );
        return await newRefreshToken
    }

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

    async update(updatePasswordDto: UpdatePasswordDto) {
        const newPassword = updatePasswordDto.password;
        let refreshToken;
        if (newPassword == undefined)
        return STATUS.BADREQUEST;
        const user = await prisma.user.findFirst({ where: { login: updatePasswordDto.login } });
        if (user == null) {
        return STATUS.NOTFOUND;
        }
        let checkPass = await bcrypt.compare(newPassword, user.password);
        let accessTokenLifeTime = new Date(Date.now() + ( 3600 * 1000 * Number(process.env.REFRESH_TOKEN_LIFETIME)) - 100);
        const accessToken = await this.generateToken(user.id, user.login, accessTokenLifeTime);
        if (user.refreshToken == undefined && user.refresTockenLifeTime == undefined){
        let refreshTokenLifeTime = new Date(Date.now() + ( 3600 * 1000 * Number(process.env.REFRESH_TOKEN_LIFETIME)));
        refreshToken = await this.generateRefreshToken(user.id, user.login, refreshTokenLifeTime);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                refresTockenLifeTime: refreshTokenLifeTime,
            version: {
                increment: 1,
            },
            updatedAt: Date.now(),
            },
        });
        } else {
        let refreshTokenLifeTime = new Date(Date.now() + ( 3600 * 1000 * Number(process.env.REFRESH_TOKEN_LIFETIME)));
        refreshToken = await this.generateRefreshToken(user.id, user.login, user.refresTockenLifeTime);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                refresTockenLifeTime: refreshTokenLifeTime,
            version: {
                increment: 1,
            },
                updatedAt: Date.now(),
            },
        });
        }
        if (!checkPass) return STATUS.WRONGDTO;
        console.log( `Tokens of #${user.login} user updated`);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

          
      async refresh(refrTocken: any){
        const user = await prisma.user.findUnique({ where: { refreshToken: refrTocken } });
          if (user == null) {
            return STATUS.WRONGDTO;
          }
        let refreshToken;
        let accessTokenLifeTime = new Date(Date.now() + ( 3600 * 1000 * Number(process.env.REFRESH_TOKEN_LIFETIME)) - 1000);
        const accessToken = await this.generateToken(user.id, user.login, accessTokenLifeTime);
          let refreshTokenLifeTime = new Date(Date.now() + ( 3600 * 1000 * Number(process.env.REFRESH_TOKEN_LIFETIME)));
          refreshToken = await this.generateRefreshToken(user.id, user.login, refreshTokenLifeTime);
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              accessToken: accessToken,
              refreshToken: refreshToken,
              refresTockenLifeTime: refreshTokenLifeTime,
              version: {
                increment: 1,
              },
              updatedAt: Date.now(),
            },
          });
        return {
          accessToken: accessToken,
          refreshToken: refreshToken
        };
      }
}

    
  
    
    


    

    


    


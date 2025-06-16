import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        global: true,
        useFactory: async (configService: ConfigService) => ({
               secret: configService.get<string>('JWT_SECRET'), // Load from .env
               signOptions: { expiresIn: '1h' }, // Token expiration time
        }),
    }),
  ],
  providers: [AuthService, UsersService, ConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

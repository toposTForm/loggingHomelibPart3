import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        // private readonly configService: ConfigService,
    ) {}
  
    async generateToken(userId: string, password: string): Promise<string> {
        const payload = { sub: userId, password: password };
        return await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET})
    }
    async generateRefreshToken(authUserId: string, currentRefreshToken?: string, currentRefreshTokenExpiresAt?: Date) {
        const newRefreshToken = this.jwtService.signAsync(
            { sub: authUserId },
            { secret: process.env.JWT_SECRET, expiresIn: `${process.env.REFRESH_TOKEN_LIFETIME}h` },
        );
        return await newRefreshToken
    }
}
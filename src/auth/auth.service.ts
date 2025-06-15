import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) {}
    async generateToken(userId: string, password: string): Promise<string> {
       const payload = { sub: userId, password: password };
       return this.jwtService.signAsync(payload);
    }
}

import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  HttpCode,
  ForbiddenException,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { STATUS } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-user.dto';
import { LoggingInterceptor } from 'src/logger/log.interceprot';
import { Public } from './public.decorator';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    if (
      !(typeof createUserDto.login == 'string') ||
      !(typeof createUserDto.password == 'string') ||
      createUserDto.login.length == 0 ||
      createUserDto.password.length <= 2
    ) {
      throw new BadRequestException(
        `body does not contain required fields or they are incorrect!`,
      );
    }
    console.log(createUserDto.login);
    return this.authService.create(createUserDto);
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  async update(@Body() updatePasswordDto: UpdatePasswordDto) {
    if (
      !(typeof updatePasswordDto.login == 'string') ||
      !(typeof updatePasswordDto.password == 'string') ||
      updatePasswordDto.login.length == 0 ||
      updatePasswordDto.password.length <= 2
    ) {
      throw new BadRequestException(
        `body does not contain required fields or they are incorrect!`,
      );
    }
    const serviceAnswer: STATUS | unknown =
      await this.authService.update(updatePasswordDto);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(
        `user with login ${updatePasswordDto.login} no found!`,
      );
    } else if ((serviceAnswer as STATUS) == STATUS.WRONGDTO) {
      throw new ForbiddenException(`Password is wrong!`);
    } else if (serviceAnswer == STATUS.BADREQUEST) {
      throw new BadRequestException(`invalid dto!`);
    } else {
      return serviceAnswer;
    }
  }

  @Public()
  @Post('/refresh')
  @HttpCode(200)
  async refresh(@Body() refreshToken: any) {
    if (refreshToken.refreshToken !== undefined)
      refreshToken = refreshToken.refreshToken;
    if (
      refreshToken == undefined ||
      refreshToken == '' ||
      refreshToken.length < 10 ||
      refreshToken.length == undefined
    ) {
      throw new UnauthorizedException(
        `body does not contain required fields or they are incorrect!`,
      );
    }
    const serviceAnswer: STATUS | unknown =
      await this.authService.refresh(refreshToken);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`user with token ${refreshToken} no found!`);
    } else if ((serviceAnswer as STATUS) == STATUS.WRONGDTO) {
      throw new ForbiddenException(`Password is wrong!`);
    } else if (serviceAnswer == STATUS.BADREQUEST) {
      throw new BadRequestException(`invalid dto!`);
    } else {
      return serviceAnswer;
    }
  }
}

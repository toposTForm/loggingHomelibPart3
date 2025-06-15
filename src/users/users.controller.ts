import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  HttpCode,
  ForbiddenException,
  UseInterceptors,
  UnauthorizedException
} from '@nestjs/common';
import { STATUS, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { validate } from 'uuid';
import { LoggingInterceptor } from 'src/logger/log.interceprot';
import { AuthService } from 'src/auth/auth.service';

@Controller('/auth')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly AuthService: AuthService) {}

  @Post('/signup') 
  create(@Body() createUserDto: CreateUserDto) {
    if (
      !(typeof createUserDto.login == 'string') ||
      !(typeof createUserDto.password == 'string') || 
      (createUserDto.login.length == 0) ||
      (createUserDto.password.length <= 2 )
    ) {
      throw new BadRequestException(`body does not contain required fields or they are incorrect!`);
    }
    console.log(createUserDto.login);
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  async update( @Body() updatePasswordDto: UpdatePasswordDto,) {
    if (
      !(typeof updatePasswordDto.login == 'string') ||
      !(typeof updatePasswordDto.password == 'string') || 
      (updatePasswordDto.login.length == 0) ||
      (updatePasswordDto.password.length <= 2 )
    ) {
      throw new BadRequestException(`body does not contain required fields or they are incorrect!`);
    }
    const serviceAnswer: STATUS | unknown = await this.usersService.update(
      updatePasswordDto,
    );
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`user with login ${updatePasswordDto.login} no found!`);
    } else if ((serviceAnswer as STATUS) == STATUS.WRONGDTO) {
      throw new ForbiddenException(`Password is wrong!`);
    } else if (serviceAnswer == STATUS.BADREQUEST) {
      throw new BadRequestException(`invalid dto!`);
    } else {
      return serviceAnswer;
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    const data: string | unknown = await this.usersService.findOne(id);
    if (data == STATUS.NOTFOUND) {
      throw new NotFoundException(`user with id ${id} no found!`);
    } else {
      return data;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (id[0] == ':') id = id.slice(1, id.length);
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    const serviceAnswer: STATUS | unknown = await this.usersService.remove(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`user with id ${id} no found!`);
    }
  }
}

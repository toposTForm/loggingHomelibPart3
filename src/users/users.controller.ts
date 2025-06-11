import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadGatewayException,
  ForbiddenException,
} from '@nestjs/common';
import { STATUS, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { validate } from 'uuid';

@Controller('/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (
      !(typeof createUserDto.login == 'string') ||
      !(typeof createUserDto.password == 'string')
    ) {
      throw new BadRequestException(`body does not contain required fields!`);
    }
    console.log(createUserDto.login);
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (id[0] == ':') id = id.slice(1, id.length);
    if (!validate(id)) {
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown = await this.usersService.update(
      id,
      updatePasswordDto,
    );
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`user with id ${id} no found!`);
    } else if ((serviceAnswer as STATUS) == STATUS.WRONGDTO) {
      throw new ForbiddenException(`oldPassword is wrong!`);
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
    let data: string | unknown = await this.usersService.findOne(id);
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
    let serviceAnswer: STATUS | unknown = await this.usersService.remove(id);
    if (serviceAnswer == STATUS.NOTFOUND) {
      throw new NotFoundException(`user with id ${id} no found!`);
    }
  }
}

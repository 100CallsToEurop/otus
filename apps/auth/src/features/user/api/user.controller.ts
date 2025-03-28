import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './models/input';
import { UserResponseDto } from './models/view';
import { UserFacade } from '../application';
import { GetCurrentUserId, Roles } from '@app/common/decorators';
import { ROLE } from '@app/consts';

@Controller('users')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Roles(ROLE.MANAGER)
  @HttpCode(201)
  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<number> {
    return await this.userFacade.commands.create(createUser);
  }

  @Roles(ROLE.MANAGER, ROLE.USER)
  @HttpCode(200)
  @Put(':userId/profile')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
    @Body() updateUser: UpdateUserDto,
  ): Promise<void> {
    if (+userId !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }
    await this.userFacade.commands.update(+userId, updateUser);
  }

  @Roles(ROLE.MANAGER)
  @HttpCode(204)
  @Delete(':userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.userFacade.commands.delete(+userId);
  }

  @Roles(ROLE.MANAGER, ROLE.USER)
  @HttpCode(200)
  @Get(':userId/profile')
  async getUser(
    @Param('userId', ParseIntPipe) userId: number,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<UserResponseDto> {
    if (+userId !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }
    return await this.userFacade.queries.get(+userId);
  }
}

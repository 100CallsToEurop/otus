import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto, UpdateUserDto } from './models/input';
import { CreateUserCommand } from '../application/commands/create-user';
import { UpdateUserCommand } from '../application/commands/update-user';
import { DeleteUserCommand } from '../application/commands/delete-user';
import { GetUserQuery } from '../application/queries/get-user';
import { UserResponseDto } from './models/view';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(201)
  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<void> {
    await this.commandBus.execute(new CreateUserCommand(createUser));
  }

  @HttpCode(200)
  @Put(':userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUser: UpdateUserDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateUserCommand(+userId, updateUser));
  }

  @HttpCode(204)
  @Delete(':userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(+userId));
  }

  @HttpCode(200)
  @Get(':userId')
  async getUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserResponseDto> {
    return await this.queryBus.execute(new GetUserQuery(+userId));
  }
}

import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  CreateUserDto,
} from './commands/create-user';
import {
  UpdateUserDto,
  UpdateUserCommand,
  UpdateUserCommandHandler,
} from './commands/update-user';

export class OrderUserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createUser: (eventId: string, createUserDto: CreateUserDto) =>
      this.createUser(eventId, createUserDto),
    updateUser: (eventId: string, updateUserDto: UpdateUserDto) =>
      this.updateUser(eventId, updateUserDto),
  };
  queries = {};

  createUser(eventId: string, createUserDto: CreateUserDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      Awaited<ReturnType<CreateUserCommandHandler['execute']>>
    >(new CreateUserCommand(eventId, createUserDto));
  }

  updateUser(eventId: string, updateUserDto: UpdateUserDto) {
    return this.commandBus.execute<
      UpdateUserCommand,
      Awaited<ReturnType<UpdateUserCommandHandler['execute']>>
    >(new UpdateUserCommand(eventId, updateUserDto));
  }
}

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
    createUser: (createProductDto: CreateUserDto) =>
      this.createUser(createProductDto),
    updateUser: (updateUserDto: UpdateUserDto) =>
      this.updateUser(updateUserDto),
  };
  queries = {};

  createUser(createProductDto: CreateUserDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      Awaited<ReturnType<CreateUserCommandHandler['execute']>>
    >(new CreateUserCommand(createProductDto));
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.commandBus.execute<
      UpdateUserCommand,
      Awaited<ReturnType<UpdateUserCommandHandler['execute']>>
    >(new UpdateUserCommand(updateUserDto));
  }
}

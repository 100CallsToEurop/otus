import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  CreateUserDto,
} from './commands/create-user';

export class OrderUserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createUser: (createProductDto: CreateUserDto) =>
      this.createUser(createProductDto),
  };
  queries = {};

  createUser(createProductDto: CreateUserDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      Awaited<ReturnType<CreateUserCommandHandler['execute']>>
    >(new CreateUserCommand(createProductDto));
  }
}

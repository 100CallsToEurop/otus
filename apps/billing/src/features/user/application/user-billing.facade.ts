import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  CreateUserDto,
} from './commands/create-user';
import { GetUserQuery, GetUserQueryHandler } from './queries/get-user';
import { AddFundsCommand, AddFundsCommandHandler } from './commands/add-funds';
import {
  DeductFundsCommand,
  DeductFundsCommandHandler,
  DeductFundsDto,
} from './commands/deduct-funds';

export class UserBillingFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createUser: (createProductDto: CreateUserDto) =>
      this.createUser(createProductDto),
    addFunds: (userId: number, amount: number) => this.addFunds(userId, amount),
    deductFunds: (deductFundsDto: DeductFundsDto) =>
      this.deductFunds(deductFundsDto),
  };
  queries = {
    getUserInfo: (userId: number) => this.getUser(userId),
  };

  createUser(createProductDto: CreateUserDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      Awaited<ReturnType<CreateUserCommandHandler['execute']>>
    >(new CreateUserCommand(createProductDto));
  }

  addFunds(userId: number, amount: number) {
    return this.commandBus.execute<
      AddFundsCommand,
      Awaited<ReturnType<AddFundsCommandHandler['execute']>>
    >(new AddFundsCommand(userId, amount));
  }

  deductFunds(deductFundsDto: DeductFundsDto) {
    return this.commandBus.execute<
      DeductFundsCommand,
      Awaited<ReturnType<DeductFundsCommandHandler['execute']>>
    >(new DeductFundsCommand(deductFundsDto));
  }

  getUser(userId: number) {
    return this.queryBus.execute<
      GetUserQuery,
      Awaited<ReturnType<GetUserQueryHandler['execute']>>
    >(new GetUserQuery(userId));
  }
}

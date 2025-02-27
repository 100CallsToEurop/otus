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
import {
  CancelPaymentCommand,
  CancelPaymentCommandHandler,
  CancelPaymentType,
} from './commands/cancel-payment';
import {
  UpdateUserCommand,
  UpdateUserCommandHandler,
  UpdateUserDto,
} from './commands/update-user';

export class UserBillingFacade {
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
    addFunds: (userId: number, amount: number) => this.addFunds(userId, amount),
    deductFunds: (eventId: string, deductFundsDto: DeductFundsDto) =>
      this.deductFunds(eventId, deductFundsDto),
    cancelPayment: (eventId: string, dto: CancelPaymentType) =>
      this.cancelPayment(eventId, dto),
  };
  queries = {
    getUserInfo: (userId: number) => this.getUser(userId),
  };

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

  addFunds(userId: number, amount: number) {
    return this.commandBus.execute<
      AddFundsCommand,
      Awaited<ReturnType<AddFundsCommandHandler['execute']>>
    >(new AddFundsCommand(userId, amount));
  }

  deductFunds(eventId: string, deductFundsDto: DeductFundsDto) {
    return this.commandBus.execute<
      DeductFundsCommand,
      Awaited<ReturnType<DeductFundsCommandHandler['execute']>>
    >(new DeductFundsCommand(eventId, deductFundsDto));
  }

  cancelPayment(eventId: string, dto: CancelPaymentType) {
    return this.commandBus.execute<
      CancelPaymentCommand,
      Awaited<ReturnType<CancelPaymentCommandHandler['execute']>>
    >(new CancelPaymentCommand(eventId, dto));
  }

  getUser(userId: number) {
    return this.queryBus.execute<
      GetUserQuery,
      Awaited<ReturnType<GetUserQueryHandler['execute']>>
    >(new GetUserQuery(userId));
  }
}

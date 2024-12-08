import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  CreateUserType,
} from './commands/create-user';
import {
  UpdateUserCommand,
  UpdateUserCommandHandler,
  UpdateUserType,
} from './commands/update-user';
import {
  DeleteUserCommand,
  DeleteUserCommandHandler,
} from './commands/delete-user';
import { GetUserQuery, GetUserQueryHandler } from './queries/get-user';

export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    create: (dto: CreateUserType) => this.createUser(dto),
    update: (userId: number, dto: UpdateUserType) => this.update(userId, dto),
    delete: (userId: number) => this.delete(userId),
  };
  queries = {
    get: (userId: number) => this.get(userId),
  };

  async createUser(dto: CreateUserType) {
    return this.commandBus.execute<
      CreateUserCommand,
      Awaited<ReturnType<CreateUserCommandHandler['execute']>>
    >(new CreateUserCommand(dto));
  }

  async update(userId: number, dto: UpdateUserType) {
    return this.commandBus.execute<
      UpdateUserCommand,
      Awaited<ReturnType<UpdateUserCommandHandler['execute']>>
    >(new UpdateUserCommand(userId, dto));
  }

  async delete(userId: number) {
    return this.commandBus.execute<
      DeleteUserCommand,
      Awaited<ReturnType<DeleteUserCommandHandler['execute']>>
    >(new DeleteUserCommand(userId));
  }

  async get(userId: number) {
    return this.queryBus.execute<
      GetUserQuery,
      Awaited<ReturnType<GetUserQueryHandler['execute']>>
    >(new GetUserQuery(userId));
  }
}

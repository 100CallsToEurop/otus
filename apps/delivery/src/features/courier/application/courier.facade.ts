import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateCourierType,
  CreateCourierCommand,
  CreateCourierCommandHandler,
} from './commands/create-courier';
import {
  CancelReserveCourierType,
  CancelReserveCourierCommandHandler,
  CancelReserveCourierCommand,
} from './commands/cancel-reserve';
import {
  ReserveCourierType,
  ReserveCourierCommandHandler,
  ReserveCourierCommand,
} from './commands/reserve-courier';
import {
  GetAllCouriersQuery,
  GetAllCouriersQueryHandler,
} from './queries/get-all-couriers';

export class CourierFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    create: (dto: CreateCourierType) => this.createUser(dto),
    reserve: (eventId: string, dto: ReserveCourierType) =>
      this.reserve(eventId, dto),
    cancelReserve: (dto: CancelReserveCourierType) => this.cancelReserve(dto),
  };
  queries = {
    getAllCouriers: () => this.getAllCouriers(),
  };

  async createUser(dto: CreateCourierType) {
    return this.commandBus.execute<
      CreateCourierCommand,
      Awaited<ReturnType<CreateCourierCommandHandler['execute']>>
    >(new CreateCourierCommand(dto));
  }

  async reserve(eventId: string, dto: ReserveCourierType) {
    return this.commandBus.execute<
      ReserveCourierCommand,
      Awaited<ReturnType<ReserveCourierCommandHandler['execute']>>
    >(new ReserveCourierCommand(eventId, dto));
  }

  async cancelReserve(dto: CancelReserveCourierType) {
    return this.commandBus.execute<
      CancelReserveCourierCommand,
      Awaited<ReturnType<CancelReserveCourierCommandHandler['execute']>>
    >(new CancelReserveCourierCommand(dto));
  }

  async getAllCouriers() {
    return this.queryBus.execute<
      GetAllCouriersQuery,
      Awaited<ReturnType<GetAllCouriersQueryHandler['execute']>>
    >(new GetAllCouriersQuery());
  }
}

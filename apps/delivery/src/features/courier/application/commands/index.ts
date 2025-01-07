import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateCourierCommandHandler } from './create-courier';
import { ReserveCourierCommandHandler } from './reserve-courier';
import { CancelReserveCourierCommandHandler } from './cancel-reserve';

export const COURIER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateCourierCommandHandler,
  ReserveCourierCommandHandler,
  CancelReserveCourierCommandHandler,
];

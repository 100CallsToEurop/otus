import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetAllCouriersQueryHandler } from './get-all-couriers';

export const COURIER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetAllCouriersQueryHandler,
];

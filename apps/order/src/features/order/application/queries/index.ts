import { IQueryHandler } from '@nestjs/cqrs';
import { GetOrdersQueryHandler } from './get-orders';
import { Type } from '@nestjs/common';

export const ORDER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetOrdersQueryHandler,
];

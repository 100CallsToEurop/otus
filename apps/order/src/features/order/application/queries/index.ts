import { IQueryHandler } from '@nestjs/cqrs';
import { GetOrderQueryHandler } from './get-order';
import { Type } from '@nestjs/common';
import { GetOrdersQueryHandler } from './get-orders';

export const ORDER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetOrderQueryHandler,
  GetOrdersQueryHandler,
];

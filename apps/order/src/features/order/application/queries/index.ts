import { IQueryHandler } from '@nestjs/cqrs';
import { GetOrderQueryHandler } from './get-order';
import { Type } from '@nestjs/common';

export const ORDER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetOrderQueryHandler,
];

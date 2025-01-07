import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetUserQueryHandler } from './get-user';

export const BILLING_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetUserQueryHandler,
];

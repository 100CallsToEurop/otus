import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { CheckKeyQueryHandler } from './check-key';

export const IDEMPOTENT_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  CheckKeyQueryHandler,
];

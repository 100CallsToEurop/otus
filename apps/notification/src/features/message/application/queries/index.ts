import { IQueryHandler } from '@nestjs/cqrs';
import { GetMessagesQueryHandler } from './get-messages';
import { Type } from '@nestjs/common';

export const MESSAGE_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetMessagesQueryHandler,
];

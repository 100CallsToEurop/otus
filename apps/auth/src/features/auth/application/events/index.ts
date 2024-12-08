import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { RegistrationUserEventHandler } from './registration-user';

export const AUTH_EVENT_HANDLERS: Type<IEventHandler>[] = [
  RegistrationUserEventHandler,
];

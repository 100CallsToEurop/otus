import { CreateUserType } from './create-user.type';

export class CreateUserCommand {
  constructor(public readonly createUser: CreateUserType) {}
}

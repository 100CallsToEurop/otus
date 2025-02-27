import { CreateUserDto } from './create-user.dto';

export class CreateUserCommand {
  constructor(
    public eventId: string,
    public createUserDto: CreateUserDto,
  ) {}
}

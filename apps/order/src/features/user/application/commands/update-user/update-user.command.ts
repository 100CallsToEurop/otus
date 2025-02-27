import { UpdateUserDto } from './update-user.dto';

export class UpdateUserCommand {
  constructor(
    public eventId: string,
    public updateUserDto: UpdateUserDto,
  ) {}
}

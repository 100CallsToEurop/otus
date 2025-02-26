import { UpdateUserDto } from './update-user.dto';

export class UpdateUserCommand {
  constructor(public updateUserDto: UpdateUserDto) {}
}

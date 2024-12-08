import { UpdateUserType } from './update-user.type';

export class UpdateUserCommand {
  constructor(
    public readonly userId: number,
    public readonly updateUserType: UpdateUserType,
  ) {}
}

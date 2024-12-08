import { IUser } from './user.interface';

export class UserResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.profile.firstName;
    this.lastName = user.profile.lastName;
    this.email = user.email;
    this.phone = user.profile.phone;
  }
}

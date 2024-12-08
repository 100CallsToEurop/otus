export class RegistrationUserEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly fullName: string,
  ) {}
}

export interface IProfile {
  firstName: string;
  lastName: string;
  phone: string;

  update(profile: Partial<IProfile>): void;
  plainToInstance(): void;
}

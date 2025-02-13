export interface IRegistrationUser {
  eventId: string;
  payload: {
    userId: number;
    email: string;
    fullName: string;
  };
}

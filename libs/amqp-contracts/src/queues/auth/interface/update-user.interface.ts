export interface IUpdateUser {
  eventId: string;
  payload: {
    userId: number;
    email: string;
    fullName: string;
  };
}

export interface INotificationMessage {
  eventId: string;
  payload: {
    userId: number;
    email: string;
    fullName: string;
    content: string;
  };
}

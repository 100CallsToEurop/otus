export interface IReserveCourier {
  eventId: string;
  payload: {
    eventType: string;
    orderId: number;
    transactionId: string;
    deliveryDate: Date;
  };
}

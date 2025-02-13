export interface ICourierReserved {
  eventId: string;
  payload: {
    orderId: number;
    transactionId: string;
    courierFullName: string;
  };
}

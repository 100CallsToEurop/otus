export interface ICancelProductReserved {
  eventId: string;
  payload: {
    orderId: number;
    transactionId: string;
  };
}

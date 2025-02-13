export interface IProductReserved {
  eventId: string;
  payload: {
    orderId: number;
    transactionId: string;
  };
}

export interface IReserveProduct {
  eventId: string;
  payload: {
    orderId: number;
    transactionId: string;
    itemsIds: number[];
  };
}

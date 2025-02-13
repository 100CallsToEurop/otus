export interface IDeductFunds {
  eventId: string;
  payload: {
    userId: number;
    orderId: number;
    transactionId: string;
    amount: number;
  };
}

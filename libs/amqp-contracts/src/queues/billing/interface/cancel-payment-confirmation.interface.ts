export interface ICancelPaymentConfirmation {
  eventId: string;
  payload: {
    orderId: number;
    transactionId: string;
  };
}

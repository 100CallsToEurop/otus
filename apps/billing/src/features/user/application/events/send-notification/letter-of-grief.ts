export const letterOfGrief = (orderId: number, fullName: string): string =>
  `Hi ${fullName}, your order ${orderId} has been cancelled due to a failed payment. Please check your payment information and try placing your order again.`;

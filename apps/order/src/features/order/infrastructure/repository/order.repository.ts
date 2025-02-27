import { IOrder } from '../../domain';

export abstract class OrderRepository {
  abstract save(order: IOrder): Promise<IOrder>;
  abstract saveOrder(eventId: string, order: IOrder): Promise<void>;
  abstract getById(
    orderId: number,
    transactionId: string,
  ): Promise<IOrder | null>;

  abstract checkById(orderId: number): Promise<IOrder | null>;

  abstract cancelPaymentConfirmation(
    eventId: string,
    transactionId: string,
    order: IOrder,
  ): Promise<void>;

  abstract cancelProductReserved(
    eventId: string,
    transactionId: string,
    order: IOrder,
  ): Promise<void>;

  abstract deductFunds(eventId: string, order: IOrder): Promise<void>;
  abstract reserveProduct(eventId: string, order: IOrder): Promise<void>;
  abstract reserveCourier(eventId: string, order: IOrder): Promise<void>;
}

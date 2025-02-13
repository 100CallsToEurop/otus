import { IOrder } from '../../domain';

export abstract class OrderRepository {
  abstract save(order: IOrder): Promise<IOrder>;
  abstract getById(
    orderId: number,
    transactionId: string,
  ): Promise<IOrder | null>;

  abstract checkById(orderId: number): Promise<IOrder | null>;

  abstract cancelPaymentConfirmation(
    transactionId: string,
    order: IOrder,
  ): Promise<void>;

  abstract cancelProductReserved(
    transactionId: string,
    order: IOrder,
  ): Promise<void>;

  abstract deductFunds(order: IOrder): Promise<void>;
  abstract reserveProduct(order: IOrder): Promise<void>;
  abstract reserveCourier(order: IOrder): Promise<void>;
}

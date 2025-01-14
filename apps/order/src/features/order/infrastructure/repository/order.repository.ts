import { IOrder } from '../../domain';

export abstract class OrderRepository {
  abstract save(order: IOrder): Promise<IOrder>;
  abstract getById(
    orderId: number,
    transactionId: string,
  ): Promise<IOrder | null>;
}

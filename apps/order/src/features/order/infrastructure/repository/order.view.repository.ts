import { IOrderView } from '../../domain/view';

export abstract class OrderViewRepository {
  abstract save(order: IOrderView): Promise<IOrderView>;
  abstract getOrder(userId: number, orderId: number): Promise<IOrderView>;
  abstract getOrderForUpdate(
    orderId: number,
    transactionId: string,
  ): Promise<IOrderView>;
  abstract getByUserId(userId: number): Promise<[IOrderView[], number]>;
}

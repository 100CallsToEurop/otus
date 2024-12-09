import { IOrder } from '../../domain';

export abstract class OrderRepository {
  abstract save(order: IOrder): Promise<IOrder>;
  abstract getById(orderId: number): Promise<IOrder | null>;
  abstract getByUser(userId: number, orderId: number): Promise<IOrder | null>;
  abstract getAll(userId: number): Promise<IOrder[]>;
}

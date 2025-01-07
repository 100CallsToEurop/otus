import { IOrderView } from '../../domain/view';

export abstract class OrderViewRepository {
  abstract save(order: IOrderView): Promise<IOrderView>;
  abstract getOrder(orderId: number): Promise<IOrderView>;
}

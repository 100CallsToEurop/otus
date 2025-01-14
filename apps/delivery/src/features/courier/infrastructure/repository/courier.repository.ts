import { ICourier } from '../../domain/courier';

export abstract class CourierRepository {
  abstract save(courier: ICourier): Promise<ICourier>;
  abstract getFreeCourier(checkDate: Date): Promise<ICourier | null>;
  abstract getCourierByOrderId(
    orderId: number,
    transactionId: string,
  ): Promise<ICourier | null>;
  abstract getAllCouriers(): Promise<ICourier[]>;
}

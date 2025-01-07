import { IBilling } from '../../domain/billing/billing.interface';

export abstract class BillingRepository {
  abstract save(product: IBilling): Promise<IBilling>;
  abstract getUser(userId: number): Promise<IBilling | null>;
  abstract getUserByOrderId(orderId: number): Promise<IBilling | null>;
}

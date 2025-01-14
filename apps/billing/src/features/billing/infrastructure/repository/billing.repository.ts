import { IBilling } from '../../domain/billing/billing.interface';

export abstract class BillingRepository {
  abstract save(product: IBilling): Promise<IBilling>;
  abstract getUser(userId: number): Promise<IBilling | null>;
  abstract getUserByTransactionId(
    orderId: number,
    transactionId: string,
  ): Promise<IBilling | null>;
}

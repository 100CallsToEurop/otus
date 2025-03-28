import { IBilling } from '../../domain/billing/billing.interface';

export abstract class BillingRepository {
  abstract save(billing: IBilling): Promise<IBilling>;
  abstract saveUser(eventId: string, billing: IBilling): Promise<void>;
  abstract saveOperation(
    eventId: string,
    orderId: number,
    transactionId: string,
    billing: IBilling,
  ): Promise<void>;
  abstract getUser(userId: number): Promise<IBilling | null>;
  abstract getUserByTransactionId(
    orderId: number,
    transactionId: string,
  ): Promise<IBilling | null>;
}

import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IPaymentConfirmation } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PaymentConfirmationContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.payment.confirmation`,
    queue: `${EXCAHANGE_OTUS.name}.payment.confirmation`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IPaymentConfirmation;
}

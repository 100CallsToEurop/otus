import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { ICancelPaymentConfirmation } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CancelPaymentConfirmationContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.cancel.payment.confirmation`,
    queue: `${EXCAHANGE_OTUS.name}.cancel.payment.confirmation`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = ICancelPaymentConfirmation;
}

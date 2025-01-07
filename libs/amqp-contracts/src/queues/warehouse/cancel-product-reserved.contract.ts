import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { ICancelProductReserved } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CancelProductReservedContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.cancel.product.reserved`,
    queue: `${EXCAHANGE_OTUS.name}.cancel.product.reserved`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = ICancelProductReserved;
}

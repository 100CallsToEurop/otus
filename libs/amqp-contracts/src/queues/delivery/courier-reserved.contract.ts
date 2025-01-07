import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { ICourierReserved } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CourierReservedContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.courier.reserved`,
    queue: `${EXCAHANGE_OTUS.name}.courier.reserved`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = ICourierReserved;
}

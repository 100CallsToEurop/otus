import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IPlaceOrder } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PlaceOrderContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.place.order`,
    queue: `${EXCAHANGE_OTUS.name}.place.order`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IPlaceOrder;
}

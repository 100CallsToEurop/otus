import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IUpdateViewOrder } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UpdateViewOrderContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.update.view.order`,
    queue: `${EXCAHANGE_OTUS.name}.update.view.order`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IUpdateViewOrder;
}

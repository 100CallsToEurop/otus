import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IReserveProduct } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReserveProductContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.reserve.product`,
    queue: `${EXCAHANGE_OTUS.name}.reserve.product`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IReserveProduct;
}

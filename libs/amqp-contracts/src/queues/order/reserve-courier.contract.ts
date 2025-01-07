import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IReserveCourier } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ReserveCourierContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.reserve.courier`,
    queue: `${EXCAHANGE_OTUS.name}.reserve.courier`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IReserveCourier;
}

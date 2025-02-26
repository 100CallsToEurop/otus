import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IUpdateUser } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UpdateUserContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.update.user`,
    queue: `${EXCAHANGE_OTUS.name}.update.user`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IUpdateUser;
}

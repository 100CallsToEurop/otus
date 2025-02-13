import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IOutboxContract } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OutboxContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.outbox`,
    queue: `${EXCAHANGE_OTUS.name}.outbox`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IOutboxContract;
}

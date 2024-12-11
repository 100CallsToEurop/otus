import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { INotificationMessage } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NotificationMessageContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.notification.message`,
    queue: `${EXCAHANGE_OTUS.name}.notification.message`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = INotificationMessage;
}

import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IRegistrationUser } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RegistrationUserContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.registration.user`,
    queue: `${EXCAHANGE_OTUS.name}.registration.user`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IRegistrationUser;
}

import { EXCAHANGE_OTUS } from '@app/amqp-contracts/exchange';
import { IQueueDeclaration } from '@app/amqp-contracts/shared';
import { IDeductFunds } from './interface';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DeductFundsContract {
  export const queue: IQueueDeclaration = {
    exchange: EXCAHANGE_OTUS,
    routingKey: `${EXCAHANGE_OTUS.name}.deduct.funds`,
    queue: `${EXCAHANGE_OTUS.name}.deduct.funds`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = IDeductFunds;
}

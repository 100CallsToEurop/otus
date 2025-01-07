import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IOrder } from '../../../domain';
import { PlaceOrderSagaState } from './place-order.state';
import { STATUS_ORDER } from '@app/consts';
import {
  PlaceOrderSagaCanceled,
  PlaceOrderSagaPaymentOrder,
  PlaceOrderSagaReserveCourier,
  PlaceOrderSagaReserveProduct,
} from './steps';
import { PlaceOrderSagaStarted } from './steps/place-order.reserve-started';
import { PlaceOrderSagaFinished } from './steps/place-order.finished';

export class PlaceOrderSaga {
  private state: PlaceOrderSagaState;

  constructor(
    public readonly order: IOrder,
    public readonly amqpConnection: AmqpConnection,
  ) {
    this.setState(this.order.status);
  }

  setState(state: STATUS_ORDER) {
    switch (state) {
      case STATUS_ORDER.PENDING:
        this.state = new PlaceOrderSagaStarted();
        break;
      case STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS:
        this.state = new PlaceOrderSagaReserveProduct();
        break;
      case STATUS_ORDER.WAITING_FOR_PAYMENT:
        this.state = new PlaceOrderSagaPaymentOrder();
        break;
      case STATUS_ORDER.WAITING_FOR_RESERVE_COURIER:
        this.state = new PlaceOrderSagaReserveCourier();
        break;
      case STATUS_ORDER.COMPLETED:
        this.state = new PlaceOrderSagaFinished();
        break;
      case STATUS_ORDER.CANCELED:
        this.state = new PlaceOrderSagaCanceled();
        break;
    }
    this.state.setContext(this);
    this.order.setStatus(state);
  }

  getState() {
    return this.state;
  }
}

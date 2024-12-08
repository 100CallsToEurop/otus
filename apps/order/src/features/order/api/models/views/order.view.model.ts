import { STATUS_ORDER } from '../../../../../const';

export class OrderViewModel {
  id: number;
  userId: number;
  status: STATUS_ORDER;
  totalPrice: number;
  created: string;
  updated: string;
}

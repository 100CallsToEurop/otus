import { ProductViewModel } from '../../../../product/api/models/views';
import { STATUS_ORDER } from '../../../../../const';

export class OrderViewModel {
  id: number;
  userId: number;
  status: STATUS_ORDER;
  totalPrice: number;
  items: ProductViewModel[];
  created: string;
  updated: string;
}

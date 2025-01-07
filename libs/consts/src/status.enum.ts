export enum STATUS_ORDER {
  PENDING = 'Ожидание',
  WAITING_FOR_RESERVE_PRODUCTS = 'Ожидание резервирования товаров',
  WAITING_FOR_PAYMENT = 'Ожидание оплаты',
  WAITING_FOR_RESERVE_COURIER = 'Ожидание резервирования курьера',
  COMPLETED = 'Готов',
  CANCELED = 'Отменен',
}

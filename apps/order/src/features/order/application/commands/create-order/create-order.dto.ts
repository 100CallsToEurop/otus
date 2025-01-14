export type CreateOrderDto = {
  userId: number;
  orderId: number;
  itemsIds: number[];
  totalPrice: number;
  deliveryDate: Date;
};

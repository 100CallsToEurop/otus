export type CreateOrderDto = {
  userId: number;
  itemsIds: number[];
  totalPrice: number;
  deliveryDate: Date;
};

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetProductsQueryHandler } from './get-products';

export const PRODUCT_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetProductsQueryHandler,
];

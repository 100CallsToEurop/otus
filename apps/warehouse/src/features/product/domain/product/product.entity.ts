import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IProduct } from './product.interface';
import {
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { IReservedProduct, ReservedProductEntity } from '../reserved-product';

@Entity('products')
export class ProductEntity implements IProduct {
  private logger = new Logger(ProductEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsString()
  @MaxLength(256)
  @Column({ name: 'product_name' })
  name: string;
  @IsNumber()
  @Min(0)
  @Column({ name: 'price', type: 'int' })
  price: number;
  @Column({ name: 'quantity', type: 'int' })
  @IsNumber()
  @Min(0)
  quantity: number;

  @OneToMany(
    () => ReservedProductEntity,
    (reservedProduct) => reservedProduct.product,
    { cascade: true },
  )
  reservedProducts: IReservedProduct[];

  static create(product: Partial<IProduct>): IProduct {
    const _product = new ProductEntity();
    _product.name = product.name;
    _product.price = product.price;
    _product.quantity = 1;
    _product.reservedProducts = [];
    const error = validateSync(_product);
    if (!!error.length) {
      error.forEach((e) => _product.logger.error(e.constraints));
      throw new Error('Create product not valid');
    }
    return _product;
  }

  addReservedProduct(orderId: number): boolean {
    if (this.quantity <= 0) return false;
    this.quantity -= 1;
    this.reservedProducts.push(
      ReservedProductEntity.create({ orderId, price: this.price, quantity: 1 }),
    );
    return true;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}

import { Injectable } from '@nestjs/common';
import { BillingRepository } from '../repository';
import { IBilling } from '../../domain/billing/billing.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BillingEntity } from '../../domain/billing/billing.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BillingAdapter implements BillingRepository {
  constructor(
    @InjectRepository(BillingEntity)
    private readonly productRepository: Repository<BillingEntity>,
  ) {}
  async save(product: IBilling): Promise<IBilling> {
    return await this.productRepository.save(product);
  }

  async getUser(userId: number): Promise<IBilling | null> {
    return await this.productRepository.findOne({
      where: { id: userId },
      relations: { wallet: true },
    });
  }
}

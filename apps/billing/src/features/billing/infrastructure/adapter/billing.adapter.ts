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
    private readonly billingRepository: Repository<BillingEntity>,
  ) {}
  async save(billing: IBilling): Promise<IBilling> {
    return await this.billingRepository.save(billing);
  }

  async getUser(userId: number): Promise<IBilling | null> {
    return await this.billingRepository.findOne({
      where: { id: userId },
      relations: { wallet: true, histories: true },
    });
  }
  async getUserByOrderId(orderId: number): Promise<IBilling> {
    return await this.billingRepository.findOne({
      where: { histories: { orderId } },
      relations: { wallet: true, histories: true },
    });
  }
}

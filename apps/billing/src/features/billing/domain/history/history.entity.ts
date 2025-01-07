import {
  IsDate,
  IsNumber,
  IsOptional,
  Min,
  validateSync,
} from 'class-validator';
import { IHistory } from './history.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Logger } from '@nestjs/common';
import { BillingEntity, IBilling } from '../billing';

@Entity('histories')
export class HistoryEntity implements IHistory {
  private logger = new Logger(HistoryEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsNumber()
  @Column()
  orderId: number;
  @IsNumber()
  @Min(0)
  @Column({ name: 'balance', type: 'int' })
  balance: number;
  @IsNumber()
  @Column({ name: 'withdrawal_amount' })
  withdrawalAmount: number;
  @IsDate()
  @Column({ name: 'transaction_date' })
  transactionDate: Date;

  @ManyToOne(() => BillingEntity, (billing) => billing.histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'billingId' })
  billing: IBilling;

  static create(history: Partial<IHistory>): IHistory {
    const _history = new HistoryEntity();
    _history.orderId = history.orderId;
    _history.balance = history.balance;
    _history.withdrawalAmount = history.withdrawalAmount;
    _history.transactionDate = new Date();
    const error = validateSync(_history);
    if (!!error.length) {
      error.forEach((e) => _history.logger.error(e.constraints));
      throw new Error('History not valid');
    }
    return _history;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}

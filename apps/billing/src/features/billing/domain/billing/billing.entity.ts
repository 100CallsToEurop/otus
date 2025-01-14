import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { IBilling } from './billing.interface';
import {
  IsOptional,
  IsNumber,
  IsString,
  validateSync,
  IsEmail,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { IWallet, WalletEntity } from '../wallet';
import { HistoryEntity, IHistory } from '../history';

@Entity('billing')
export class BillingEntity implements IBilling {
  private logger = new Logger(BillingEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryColumn()
  id: number;
  @IsString()
  @IsEmail()
  @Column({ name: 'email' })
  email: string;
  @IsString()
  @Column({ name: 'full_name' })
  fullName: string;
  @IsOptional()
  @OneToOne(() => WalletEntity, (wallet) => wallet.user, {
    cascade: true,
  })
  @JoinColumn()
  wallet: IWallet;
  @IsOptional()
  @OneToMany(() => HistoryEntity, (histories) => histories.billing, {
    cascade: true,
  })
  histories: IHistory[];

  static create(user: Partial<IBilling>): IBilling {
    const _user = new BillingEntity();
    _user.id = user.id;
    _user.email = user.email;
    _user.fullName = user.fullName;
    _user.wallet = WalletEntity.create();
    _user.histories = [];
    const error = validateSync(_user);
    if (!!error.length) {
      error.forEach((e) => _user.logger.error(e.constraints));
      throw new Error('Create user not valid');
    }
    return _user;
  }

  addWalletFunds(amount: number): void {
    if (amount <= 0) {
      return;
    }
    return this.wallet.addFunds(amount);
  }
  deductWalletFunds(
    orderId: number,
    transactionId: string,
    amount: number,
  ): boolean {
    if (amount <= 0) {
      return false;
    }
    const walletFunds = this.wallet.getFunds();
    if (amount > walletFunds) return false;
    this.wallet.deductFunds(amount);
    const history = HistoryEntity.create({
      orderId,
      transactionId,
      balance: this.wallet.getFunds(),
      withdrawalAmount: -amount,
    });
    history.billing = this;
    this.histories.push(history);
    return true;
  }
  getWalletFunds(): number {
    return this.wallet.getFunds();
  }

  cancelTransaction(orderId: number, transactionId: string): void {
    const history = this.histories.find(
      (h) => h.transactionId === transactionId,
    );
    this.wallet.addFunds(history.withdrawalAmount * -1);
    const newHistory = HistoryEntity.create({
      orderId,
      transactionId,
      balance: this.wallet.getFunds(),
      withdrawalAmount: history.withdrawalAmount * -1,
    });
    this.histories.push(newHistory);
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}

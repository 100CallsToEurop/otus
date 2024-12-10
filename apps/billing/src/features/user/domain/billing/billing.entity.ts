import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
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
  @OneToOne(() => WalletEntity, (wallet) => wallet.user, {
    cascade: true,
  })
  @JoinColumn()
  wallet: IWallet;

  static create(user: Partial<IBilling>): IBilling {
    const _user = new BillingEntity();
    _user.id = user.id;
    _user.email = user.email;
    _user.fullName = user.fullName;
    _user.wallet = WalletEntity.create();
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
  deductWalletFunds(amount: number): boolean {
    if (amount <= 0) {
      return false;
    }
    const walletFunds = this.wallet.getFunds();
    if (amount > walletFunds) return false;
    this.wallet.deductFunds(amount);
    return true;
  }
  getWalletFunds(): number {
    return this.wallet.getFunds();
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}

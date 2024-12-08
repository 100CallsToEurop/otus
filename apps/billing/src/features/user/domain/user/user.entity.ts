import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IUser } from './user.interface';
import {
  IsOptional,
  IsNumber,
  IsString,
  validateSync,
  IsEmail,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { IWallet, WalletEntity } from '../wallet';

@Entity('products')
export class UserEntity implements IUser {
  private logger = new Logger(UserEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryColumn()
  id: number;
  @IsString()
  @Column({ name: 'email' })
  fullName: string;
  @IsString()
  @IsEmail()
  @Column({ name: 'full_name' })
  email: string;
  @OneToOne(() => WalletEntity, (wallet) => wallet.user, {
    cascade: true,
  })
  @JoinColumn()
  wallet: IWallet;

  static create(user: Partial<IUser>): IUser {
    const _user = new UserEntity();
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
      throw new Error('Amount must be positive.');
    }
    return this.wallet.addFunds(amount);
  }
  deductWalletFunds(amount: number): boolean {
    if (amount <= 0) {
      throw new Error('Amount must be positive.');
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

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IWallet } from './wallet.interface';
import { IsOptional, IsNumber, validateSync, Min } from 'class-validator';
import { Logger } from '@nestjs/common';
import { IUser, UserEntity } from '../user';

@Entity('wallets')
export class WalletEntity implements IWallet {
  private logger = new Logger(WalletEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsNumber()
  @Min(0)
  @Column({ name: 'balance', type: 'decimal' })
  balance: number;
  @OneToOne(() => UserEntity, (user) => user.wallet, {
    onDelete: 'CASCADE',
  })
  user: IUser;

  static create(): IWallet {
    const _wallet = new WalletEntity();
    _wallet.balance = 0;
    const error = validateSync(_wallet);
    if (!!error.length) {
      error.forEach((e) => _wallet.logger.error(e.constraints));
      throw new Error('Create wallet not valid');
    }
    return _wallet;
  }

  addFunds(amount: number): void {
    this.balance += amount;
  }
  deductFunds(amount: number): void {
    this.balance -= amount;
  }
  getFunds(): number {
    return this.balance;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IMessage } from './message.interface';
import {
  IsOptional,
  IsNumber,
  IsDate,
  validateSync,
  IsString,
} from 'class-validator';
import { Logger } from '@nestjs/common';

@Entity('messages')
export class MessageEntity implements IMessage {
  private logger = new Logger(MessageEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsNumber()
  @Column()
  userId: number;

  @IsString()
  @Column()
  content: string;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  static create(message: Partial<IMessage>): IMessage {
    const _message = new MessageEntity();
    _message.userId = message.userId;
    _message.content = message.content;
    _message.createdAt = new Date();
    const error = validateSync(_message);
    if (!!error.length) {
      error.forEach((e) => _message.logger.error(e.constraints));
      throw new Error('Create message not valid');
    }
    return _message;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}

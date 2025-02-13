import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyService } from './application/service';
import { IdempotencyEntity } from './domain';
import { IdempotencyAdapter } from './infrastructure/adapter';
import { IdempotencyRepository } from './infrastructure/repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([IdempotencyEntity])],
  providers: [
    IdempotencyService,
    {
      provide: IdempotencyRepository,
      useClass: IdempotencyAdapter,
    },
  ],
  exports: [IdempotencyService],
})
export class IdempotencyModule {}

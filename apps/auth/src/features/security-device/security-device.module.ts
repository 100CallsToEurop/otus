import { Module } from '@nestjs/common';
import { SecurityDevicesRepository } from './infrastructure/repository';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityDeviceEntity } from './domain';
// import { SecurityDevicesController } from './api';
import { SecurityDevicesAdapter } from './infrastructure/adapter';
import { DEVICES_COMMAND_HANDLERS } from './application/commands';
import { DEVICE_EVENT_HANDLERS } from './application/events';
import { DEVICES_QUERY_HANDLERS } from './application/queries';
import {
  SecurityDevicesFacade,
  securityDevicesFacadeFactory,
} from './application';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([SecurityDeviceEntity])],
  controllers: [
    /*SecurityDevicesController*/
  ],
  providers: [
    ...DEVICES_COMMAND_HANDLERS,
    ...DEVICE_EVENT_HANDLERS,
    ...DEVICES_QUERY_HANDLERS,
    {
      provide: SecurityDevicesFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: securityDevicesFacadeFactory,
    },
    {
      provide: SecurityDevicesRepository,
      useClass: SecurityDevicesAdapter,
    },
  ],
  exports: [SecurityDevicesRepository],
})
export class SecurityDeviceModule {}

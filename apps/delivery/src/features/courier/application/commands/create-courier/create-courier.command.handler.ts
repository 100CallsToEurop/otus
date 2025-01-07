import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCourierCommand } from './create-courier.command';
import { Logger } from '@nestjs/common';
import { CourierRepository } from '../../../infrastructure/repository';
import { CourierEntity } from '../../../domain/courier';

@CommandHandler(CreateCourierCommand)
export class CreateCourierCommandHandler
  implements ICommandHandler<CreateCourierCommand, { courierId: number }>
{
  private logger = new Logger(CreateCourierCommandHandler.name);
  constructor(private readonly courierRepository: CourierRepository) {}

  async execute({
    createCourier,
  }: CreateCourierCommand): Promise<{ courierId: number }> {
    this.logger.log(`Create courier ${createCourier.fullName}`);
    const newCourier = CourierEntity.create(createCourier);
    newCourier.plainToInstance();
    const courier = await this.courierRepository.save(newCourier);
    return { courierId: courier.id };
  }
}

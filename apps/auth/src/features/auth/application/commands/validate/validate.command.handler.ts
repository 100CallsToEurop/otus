import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateCommand } from './validate.command';
import { TokensService } from '../../services';

@CommandHandler(ValidateCommand)
export class ValidateCommandHandler
  implements ICommandHandler<ValidateCommand, boolean>
{
  constructor(private readonly tokensService: TokensService) {}
  async execute({ accessToken }: ValidateCommand): Promise<boolean> {
    return await this.tokensService.validateAccessToken(accessToken);
  }
}

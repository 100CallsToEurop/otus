import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpBadTokensCommand } from './delete.expired.bad.token.command';
import { BadTokenRepository } from '../../../infrastructure/repository';
import { TokensService } from '../../services';

@CommandHandler(DeleteExpBadTokensCommand)
export class DeleteExpBadTokensCommandHandler
  implements ICommandHandler<DeleteExpBadTokensCommand>
{
  constructor(
    private readonly tokensService: TokensService,
    private readonly badTokensRepository: BadTokenRepository,
  ) {}

  async execute(): Promise<void> {
    const resultTokens = [];
    const expData = new Date();
    const tokens = await this.badTokensRepository.getTokens();

    tokens.forEach((token) => {
      const decodeToken = this.tokensService.decodeToken(token.token);
      decodeToken['exp'] < Math.trunc(expData.getTime() / 1000) &&
        resultTokens.push(token);
    });

    await this.badTokensRepository.deleteTokens(resultTokens);
  }
}

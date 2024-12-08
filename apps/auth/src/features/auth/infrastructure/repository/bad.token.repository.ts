import { IBadToken } from '../../domain';

export abstract class BadTokenRepository {
  abstract save(entity: IBadToken): Promise<IBadToken>;
  abstract getTokens(): Promise<IBadToken[]>;
  abstract findByRefreshToken(refreshToken: string): Promise<IBadToken>;
  abstract deleteTokens(tokens: Array<string>): Promise<void>;
}

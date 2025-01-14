import { IIdempotent } from '../../domain';

export abstract class IdempotentRepository {
  abstract save(idempotent: IIdempotent): Promise<IIdempotent>;
  abstract checkById(id: string): Promise<IIdempotent | null>;
}

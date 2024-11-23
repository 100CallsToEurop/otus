import { hash } from 'bcryptjs';
import * as bcryptjs from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10);
};

export const isHashedEquals = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcryptjs.compare(password, hashedPassword);
};

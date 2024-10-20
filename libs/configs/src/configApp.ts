import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipesSetup';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
};

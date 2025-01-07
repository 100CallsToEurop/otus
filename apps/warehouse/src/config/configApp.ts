import { pipesSetup, prefixSetup, corseSetup } from '@app/configs';
import { INestApplication } from '@nestjs/common';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
  prefixSetup(app);
  corseSetup(app);
};

import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipesSetup';
import { cookieParserSetup } from './cookieParserSetup';
// import { prefixSetup } from './prefixSetup';
import { corseSetup } from './corseSetup';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
  cookieParserSetup(app);
  // prefixSetup(app);
  corseSetup(app);
};

import {
  pipesSetup,
  cookieParserSetup,
  prefixSetup,
  corseSetup,
} from '@app/configs';
import { INestApplication } from '@nestjs/common';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
  cookieParserSetup(app);
  prefixSetup(app);
  corseSetup(app);
};

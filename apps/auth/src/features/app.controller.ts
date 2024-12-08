import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  @HttpCode(200)
  @Get('/health')
  async healthCheck() {
    return true;
  }
}

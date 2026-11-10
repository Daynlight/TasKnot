import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getHealth() {
    try {
      return {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        { status: 'unhealthy', error: error.message },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

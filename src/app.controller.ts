import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/statistics')
  @CacheKey('api:statistics')
  @CacheTTL(5)
  statistics() {
    return this.appService.getStatistics();
  }
}

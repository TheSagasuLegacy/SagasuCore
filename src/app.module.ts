import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DialogsModule } from './dialogs/dialogs.module';
import { ElasticIndexModule } from './elastic-index/elastic-index.module';
import { LoggerMiddleware } from './logger.middleware';
import { RequestLocalMiddleware } from './request-local.middleware';
import { SeriesModule } from './series/series.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.get<string>('DATABASE_URL'),
      }),
    }),
    SeriesModule,
    DialogsModule,
    ElasticIndexModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLocalMiddleware).forRoutes('**');
    consumer.apply(LoggerMiddleware).forRoutes('**');
  }
}

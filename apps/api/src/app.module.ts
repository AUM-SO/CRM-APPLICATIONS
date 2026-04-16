import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { MockDataModule } from './shared/mock-data/mock-data.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

@Module({
  imports: [MockDataModule, AuthModule, CustomersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}

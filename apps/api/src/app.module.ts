import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { MockDataModule } from './shared/mock-data/mock-data.module';

@Module({
  imports: [MockDataModule, AuthModule, CustomersModule],
})
export class AppModule {}

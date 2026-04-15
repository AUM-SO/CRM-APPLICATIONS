import { Injectable } from '@nestjs/common';
import { CustomerEntity } from '../../entity/customer.entity';
import { generateMockCustomers } from './mock-customers.generator';

@Injectable()
export class MockDataService {
  private readonly customers: CustomerEntity[] = generateMockCustomers();

  getCustomers(): CustomerEntity[] {
    return this.customers;
  }

  getCustomerById(id: number): CustomerEntity | undefined {
    return this.customers.find((c) => c.id === id);
  }
}

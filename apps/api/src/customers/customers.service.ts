import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from '../entity/customer.entity';
import { PaginatedResult } from '../common/interfaces/pagination.interface';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../common/constants';
import { MockDataService } from '../shared/mock-data/mock-data.service';
import { QueryCustomersDto, SortBy, SortOrder } from './dto/query-customers.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly mockDataService: MockDataService) {}

  findAll(query: QueryCustomersDto): PaginatedResult<CustomerEntity> {
    const {
      search,
      sortBy,
      order = SortOrder.ASC,
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
    } = query;

    let results = [...this.mockDataService.getCustomers()];

    if (search?.trim()) {
      const term = search.trim().toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.company.toLowerCase().includes(term) ||
          c.salesperson.toLowerCase().includes(term),
      );
    }

    if (sortBy) {
      results.sort((a, b) => {
        let valA: string | number;
        let valB: string | number;

        switch (sortBy) {
          case SortBy.NAME:
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
          case SortBy.TOTAL_SPEND:
            valA = a.total_spend;
            valB = b.total_spend;
            break;
          case SortBy.NUMBER_OF_PURCHASES:
            valA = a.number_of_purchases;
            valB = b.number_of_purchases;
            break;
          case SortBy.STATUS:
            valA = a.status.toLowerCase();
            valB = b.status.toLowerCase();
            break;
          case SortBy.LAST_ACTIVITY:
            valA = new Date(a.last_activity).getTime();
            valB = new Date(b.last_activity).getTime();
            break;
          default:
            return 0;
        }

        if (valA < valB) return order === SortOrder.ASC ? -1 : 1;
        if (valA > valB) return order === SortOrder.ASC ? 1 : -1;
        return 0;
      });
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = results.slice(offset, offset + limit);

    return { data, total, page, limit, totalPages };
  }

  findOne(id: number): CustomerEntity {
    const customer = this.mockDataService.getCustomerById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }
}

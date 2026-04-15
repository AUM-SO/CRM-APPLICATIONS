import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { QueryCustomersDto } from './dto/query-customers.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query() query: QueryCustomersDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }
}

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export enum SortBy {
  NAME = 'name',
  TOTAL_SPEND = 'total_spend',
  NUMBER_OF_PURCHASES = 'number_of_purchases',
  STATUS = 'status',
  LAST_ACTIVITY = 'last_activity',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryCustomersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

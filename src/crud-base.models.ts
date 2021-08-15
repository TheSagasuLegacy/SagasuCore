import { Type as ClassType } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive, Max } from 'class-validator';
import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';

export interface UpdateChecker<T> {
  (entity: T): Promise<boolean> | boolean;
}

export interface ICreateMany<T = unknown> {
  bulk: T[];
}

export type TPaginate<T> = Pagination<T, PaginationMeta>;

export class PaginationMeta implements IPaginationMeta {
  @ApiProperty({ type: Number })
  itemCount: number;

  @ApiProperty({ type: Number })
  totalItems: number;

  @ApiProperty({ type: Number })
  itemsPerPage: number;

  @ApiProperty({ type: Number })
  totalPages: number;

  @ApiProperty({ type: Number })
  currentPage: number;
}

export class PaginationLinks implements IPaginationLinks {
  @ApiProperty({ type: String, format: 'url' })
  first: string;

  @ApiProperty({ type: String, format: 'url' })
  previous: string;

  @ApiProperty({ type: String, format: 'url' })
  next: string;

  @ApiProperty({ type: String, format: 'url' })
  last: string;
}

export function CreateMany<Model>(
  model: ClassType<Model>,
): ClassType<ICreateMany<Model>> {
  class CreateMany implements ICreateMany<Model> {
    @ApiProperty({ type: model })
    bulk: Model[];
  }
  return CreateMany;
}

export function PaginatedResult<Model>(
  model: ClassType<Model>,
): ClassType<TPaginate<Model>> {
  class PaginatedResult extends Pagination<Model, PaginationMeta> {
    @ApiProperty({ type: model })
    items: Model[];

    @ApiProperty({ type: PaginationMeta })
    meta: PaginationMeta;

    @ApiProperty({ type: PaginationLinks })
    links: PaginationLinks;
  }
  return PaginatedResult;
}

export class PaginationOptionsDto
  implements IPaginationOptions<PaginationMeta>
{
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({ type: Number, default: 30, maximum: 50, minimum: 0 })
  @IsPositive()
  @Max(50)
  @Type(() => Number)
  limit: number = 30;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({ type: Number, default: 1, minimum: 1 })
  @IsPositive()
  @Type(() => Number)
  page: number = 1;
}

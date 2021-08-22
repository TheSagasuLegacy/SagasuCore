/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type as ClassType } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { METADATA_FACTORY_NAME } from '@nestjs/swagger/dist/plugin/plugin-constants';
import { BUILT_IN_TYPES } from '@nestjs/swagger/dist/services/constants';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, Max } from 'class-validator';
import { Request } from 'express';
import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions as IPaginationOptionsBase,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { getMetadataArgsStorage } from 'typeorm';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

export type TPaginate<T> = Pagination<T, PaginationMeta>;

export { EntityFieldsNames };

export enum PaginationOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IUserRequest extends Request {
  user: Express.User;
}

export interface ICreateMany<T = unknown> {
  bulk: T[];
}

export interface IPaginationOptions<Entity = unknown>
  extends IPaginationOptionsBase<PaginationMeta> {
  join?: EntityFieldsNames<Entity>[];
  sort_key?: EntityFieldsNames<Entity>;
  sort_order?: PaginationOrder;
}

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

export function CreateMany<Entity>(
  model: ClassType<Entity>,
): ClassType<ICreateMany<Entity>> {
  class CreateMany implements ICreateMany<Entity> {
    @ApiProperty({ type: model })
    bulk: Entity[];
  }
  return CreateMany;
}

export function PaginatedResult<Entity>(
  model: ClassType<Entity>,
): ClassType<TPaginate<Entity>> {
  class PaginatedResult extends Pagination<Entity, PaginationMeta> {
    @ApiProperty({ type: model })
    items: Entity[];

    @ApiProperty({ type: PaginationMeta })
    meta: PaginationMeta;

    @ApiProperty({ type: PaginationLinks })
    links: PaginationLinks;
  }
  return PaginatedResult;
}

export function PaginationOptions<Entity>(
  model: ClassType<Entity>,
): ClassType<IPaginationOptions<Entity>> {
  const baseTypes = new Set([...BUILT_IN_TYPES, Date]);
  const entityTypes = new Set(
    getMetadataArgsStorage().tables.map((t) => t.target),
  );

  const modelProperties = Object.fromEntries(
    Object.entries(
      (
        model[METADATA_FACTORY_NAME] as () => {
          [key: string]: {
            required: boolean;
            type?: () => ObjectConstructor;
          };
        }
      )(),
    ).map(([key, value]) => [key, value.type ? value.type() : undefined]),
  );
  const baseProperties = Object.entries(modelProperties)
    .filter(([key, value]) => (value ? baseTypes.has(value) : false))
    .map(([key, value]) => key);
  const entityProperties = Object.entries(modelProperties)
    .filter(([key, value]) => (value ? entityTypes.has(value) : false))
    .map(([key, value]) => key);

  class PaginationOptions implements IPaginationOptions<Entity> {
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

    @ApiProperty({
      type: 'enum',
      enum: entityProperties,
      required: false,
      isArray: true,
    })
    @IsOptional()
    @IsEnum(entityProperties, { each: true })
    @Transform(({ value }) =>
      Array.from(typeof value === 'string' ? [value] : value),
    )
    join?: EntityFieldsNames<Entity>[];

    @ApiProperty({ type: 'enum', enum: baseProperties, required: false })
    @IsOptional()
    @IsEnum(baseProperties)
    @Type(() => String)
    sort_key?: EntityFieldsNames<Entity>;

    @ApiProperty({ type: 'enum', enum: PaginationOrder, required: false })
    @IsOptional()
    @IsEnum(PaginationOrder)
    @Type(() => String)
    sort_order?: PaginationOrder;
  }

  return PaginationOptions;
}

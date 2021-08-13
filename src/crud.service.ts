/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Type as ClassType,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive, Max } from 'class-validator';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityNotFoundError, Repository } from 'typeorm';

export interface UpdateChecker<T> {
  (entity: T): Promise<boolean> | boolean;
}

export interface CreateManyDto<T = unknown> {
  bulk: T[];
}

export class PaginationDto implements IPaginationOptions {
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

@Injectable()
export class CrudBaseService<Entity> {
  constructor(
    protected repo: Repository<Entity>,
    protected primary: string = 'id',
  ) {}

  protected get entityType(): ClassType<Entity> {
    return this.repo.target as ClassType<Entity>;
  }

  public async getMany(options: PaginationDto): Promise<Pagination<Entity>> {
    return await paginate<Entity>(this.repo, options);
  }

  public async getOne(primary: unknown): Promise<Entity> {
    try {
      return await this.repo.findOneOrFail({ [this.primary]: primary });
    } catch (err) {
      throw err instanceof EntityNotFoundError
        ? new NotFoundException(
            `condition ${this.primary}=${primary} not found`,
          )
        : err;
    }
  }

  public async createOne(dto: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repo.merge(new this.entityType(), dto);
    return await this.repo.save<any>(entity);
  }

  public async createMany(
    dto: CreateManyDto<DeepPartial<Entity>>,
    chunk = 50,
  ): Promise<Entity[]> {
    if (dto.bulk.length <= 0) {
      throw new BadRequestException(`Empty bulk data`);
    }
    const entities = dto.bulk.map((entity) =>
      this.repo.merge(new this.entityType(), entity),
    );
    return await this.repo.save<any>(entities, { chunk });
  }

  public async updateOne(
    primary: unknown,
    dto: DeepPartial<Entity>,
    checker?: UpdateChecker<Entity>,
  ): Promise<Entity> {
    const found = await this.getOne(primary);
    if (checker && !(await checker(found))) {
      throw new ForbiddenException(`Target entity is forbidden to update`);
    }
    const entity = this.repo.merge(found, dto);
    return await this.repo.save<any>(entity);
  }

  public async deleteOne(primary: unknown, softdelete = false): Promise<void> {
    const found = await this.getOne(primary);
    if (softdelete === true) {
      await this.repo.softDelete(found);
    } else {
      await this.repo.delete(found);
    }
  }
}

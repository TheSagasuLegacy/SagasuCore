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
import { storage } from './request-local.middleware';

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
export abstract class CrudBaseService<
  Entity,
  PrimaryType = unknown,
  CreateDto extends DeepPartial<Entity> = Entity,
  UpdateDto extends DeepPartial<Entity> = Entity,
> {
  constructor(
    protected repo: Repository<Entity>,
    protected primary: string = 'id',
  ) {}

  protected get entityType(): ClassType<Entity> {
    return this.repo.target as ClassType<Entity>;
  }

  protected get currentUser(): Express.User | undefined {
    return storage.getStore().request.user;
  }

  protected assertPermission(value: boolean): void {
    if (!value) {
      throw new ForbiddenException(
        `Permission denied to operate entity '${this.entityType.name}'`,
      );
    }
  }

  abstract canCreate(
    dto: CreateDto,
    user?: Express.User,
  ): Promise<boolean> | boolean;

  abstract canRead(
    primary?: PrimaryType,
    user?: Express.User,
  ): Promise<boolean> | boolean;

  abstract canUpdate(
    dto: UpdateDto,
    entity: Entity,
    user?: Express.User,
  ): Promise<boolean> | boolean;

  abstract canDelete(
    primary: PrimaryType,
    user?: Express.User,
  ): Promise<boolean> | boolean;

  public async getMany(options: PaginationDto): Promise<Pagination<Entity>> {
    this.assertPermission(await this.canRead(undefined, this.currentUser));
    return await paginate<Entity>(this.repo, options);
  }

  public async getOne(primary: PrimaryType): Promise<Entity> {
    this.assertPermission(await this.canRead(primary, this.currentUser));
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

  public async createOne(dto: CreateDto): Promise<Entity> {
    this.assertPermission(await this.canCreate(dto, this.currentUser));
    const entity = this.repo.merge(new this.entityType(), dto);
    return await this.repo.save<any>(entity);
  }

  public async createMany(
    dto: CreateManyDto<CreateDto>,
    chunk = 50,
  ): Promise<Entity[]> {
    if (dto?.bulk?.length <= 0) {
      throw new BadRequestException(`Empty bulk data`);
    }
    const entities = await Promise.all(
      dto.bulk.map(async (entity) => {
        this.assertPermission(await this.canCreate(entity, this.currentUser));
        return this.repo.merge(new this.entityType(), entity);
      }),
    );
    return await this.repo.save<any>(entities, { chunk });
  }

  public async updateOne(
    primary: PrimaryType,
    dto: UpdateDto,
  ): Promise<Entity> {
    const found = await this.getOne(primary);
    this.assertPermission(await this.canUpdate(dto, found, this.currentUser));
    const entity = this.repo.merge(found, dto);
    return await this.repo.save<any>(entity);
  }

  public async deleteOne(
    primary: PrimaryType,
    softDelete = false,
  ): Promise<void> {
    this.assertPermission(await this.canDelete(primary, this.currentUser));

    const found = await this.getOne(primary);
    if (softDelete === true) {
      await this.repo.softDelete(found);
    } else {
      await this.repo.delete(found);
    }
  }
}

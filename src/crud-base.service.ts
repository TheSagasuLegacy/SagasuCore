/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Type as ClassType,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IPaginationMeta, paginate } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityNotFoundError, Repository } from 'typeorm';
import {
  ICreateMany,
  PaginationMeta,
  PaginationOptionsDto,
  TPaginate,
} from './crud-base.models';
import { storage } from './request-local.middleware';

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

  protected get currentRequest() {
    return storage.getStore().request;
  }

  protected get currentUser(): Express.User | undefined {
    return this.currentRequest.user;
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

  public async getMany(
    options: PaginationOptionsDto,
  ): Promise<TPaginate<Entity>> {
    this.assertPermission(await this.canRead(undefined, this.currentUser));
    return await paginate<Entity, PaginationMeta>(this.repo, {
      ...options,
      route: this.currentRequest.path,
      metaTransformer: (meta) =>
        plainToClass<PaginationMeta, IPaginationMeta>(PaginationMeta, meta),
    });
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
    dto: ICreateMany<CreateDto>,
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

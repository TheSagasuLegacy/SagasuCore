/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Type as ClassType,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isArray } from 'class-validator';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { IPaginationMeta, paginate } from 'nestjs-typeorm-paginate';
import { DeepPartial, Repository } from 'typeorm';
import {
  ICreateMany,
  IPaginationOptions,
  IUserRequest,
  PaginationMeta,
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
  @InjectRolesBuilder()
  protected rolesBuilder: RolesBuilder;

  constructor(
    protected repo: Repository<Entity>,
    protected primary: keyof Entity,
  ) {}

  protected get entityType(): ClassType<Entity> {
    return this.repo.target as ClassType<Entity>;
  }

  protected request() {
    const request = storage.getStore()?.request;
    if (!request?.user) {
      throw new InternalServerErrorException(
        'request object is not available now',
      );
    }
    return request as IUserRequest;
  }

  protected async assert(result: boolean | Promise<boolean>): Promise<void> {
    const value = await result;
    if (!value)
      throw new ForbiddenException(
        `Permission denied to operate entity '${this.entityType.name}'`,
      );
  }

  abstract canCreate(data: {
    dto: CreateDto;
    user: Express.User;
  }): Promise<boolean> | boolean;

  abstract canRead(data: {
    primary?: PrimaryType;
    entity?: Entity;
    user: Express.User;
  }): Promise<boolean> | boolean;

  abstract canUpdate(data: {
    dto: UpdateDto;
    entity: Entity;
    user: Express.User;
  }): Promise<boolean> | boolean;

  abstract canDelete(data: {
    primary: PrimaryType;
    entity: Entity;
    user: Express.User;
  }): Promise<boolean> | boolean;

  public async getMany(
    options: IPaginationOptions<Entity>,
  ): Promise<TPaginate<Entity>> {
    const { user, path } = this.request();
    await this.assert(this.canRead({ user: user }));
    return await paginate<Entity, PaginationMeta>(
      this.repo
        .createQueryBuilder()
        .orderBy(
          options.sort_key && options.sort_order
            ? { [options.sort_key]: options.sort_order }
            : {},
        ),
      {
        ...options,
        route: path,
        metaTransformer: (meta) =>
          plainToClass<PaginationMeta, IPaginationMeta>(PaginationMeta, meta),
      },
    );
  }

  public async getOne(primary: PrimaryType): Promise<Entity> {
    const entity = await this.repo.findOne({ [this.primary]: primary });
    await this.assert(
      this.canRead({ primary, entity, user: this.request().user }),
    );
    if (!entity)
      throw new NotFoundException(
        `condition ${this.primary}=${primary} not found`,
      );
    return entity;
  }

  public async createOne(dto: CreateDto): Promise<Entity> {
    await this.assert(this.canCreate({ dto, user: this.request().user }));
    const entity = this.repo.merge(new this.entityType(), dto);
    return await this.repo.save<any>(entity);
  }

  public async createMany(
    dto: ICreateMany<CreateDto>,
    chunk = 50,
  ): Promise<Entity[]> {
    if (isArray(dto?.bulk) || dto.bulk.length <= 0) {
      throw new BadRequestException(`Empty bulk data`);
    }
    const entities = await Promise.all(
      dto.bulk.map(async (d) => {
        await this.assert(
          this.canCreate({ dto: d, user: this.request().user }),
        );
        return this.repo.merge(new this.entityType(), d);
      }),
    );
    return await this.repo.save<any>(entities, { chunk });
  }

  public async updateOne(
    primary: PrimaryType,
    dto: UpdateDto,
  ): Promise<Entity> {
    const found = await this.getOne(primary);
    await this.assert(
      this.canUpdate({ dto, entity: found, user: this.request().user }),
    );
    const entity = this.repo.merge(found, dto);
    return await this.repo.save<any>(entity);
  }

  public async deleteOne(
    primary: PrimaryType,
    softDelete = false,
  ): Promise<void> {
    const entity = await this.getOne(primary);
    await this.assert(
      this.canDelete({ primary, entity, user: this.request().user }),
    );
    if (softDelete === true) {
      await this.repo.softDelete(entity);
    } else {
      await this.repo.delete(entity);
    }
  }
}

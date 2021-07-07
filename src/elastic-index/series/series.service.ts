import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SeriesIndexService {
  private logger: Logger = new Logger(SeriesIndexService.name);

  constructor(private elastic: ElasticsearchService) {}

  /**
   * Create index of series
   */
  async create() {
    if (
      (await this.elastic.indices.get({ index: 'series' })).statusCode == 200
    ) {
      return;
    }
    const result = await this.elastic.indices.create({
      index: 'series',
      body: {
        mappings: {
          properties: {
            name: {
              type: 'text',
              analyzer: 'kuromoji',
            },
            name_cn: {
              type: 'text',
              analyzer: 'smartcn',
            },
            description: {
              type: 'text',
              analyzer: 'smartcn',
            },
          },
        },
      },
    });
    this.logger.log(
      `Index of series created, code=${result.statusCode}, body=${result.body}`,
    );
    return result;
  }

  async insert(data: {
    id: number;
    name: string;
    name_cn?: string;
    description?: string;
  }) {
    return this.elastic.index({
      index: 'series',
      id: data.id.toString(),
      body: {
        name: data.name,
        name_cn: data.name_cn,
        description: data.description,
      },
    });
  }

  async read(id: number) {
    return this.elastic.get({ index: 'series', id: id.toString() });
  }

  async search(
    match: { name?: string; name_cn?: string; description?: string },
    from?: number,
    size?: number,
  ) {
    return this.elastic.search({
      index: 'series',
      body: { from, size, query: { match } },
    });
  }

  async delete(id: number) {
    return this.elastic.delete({ index: 'series', id: id.toString() });
  }
}

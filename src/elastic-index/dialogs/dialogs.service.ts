import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class DialogsIndexService {
  private logger: Logger = new Logger(DialogsIndexService.name);

  constructor(private elastic: ElasticsearchService) {}

  async create() {
    try {
      await this.elastic.indices.get({ index: 'dialogs' });
    } catch {
      await this.elastic.indices.create({ index: 'dialogs' });
    }
    const result = await this.elastic.indices.putMapping({
      index: 'dialogs',
      body: {
        properties: {
          content: {
            type: 'text',
            analyzer: 'smartcn',
            fields: {
              suggest: {
                type: 'completion',
                analyzer: 'smartcn',
              },
            },
          },
          filename: { type: 'text', analyzer: 'standard' },
        },
      },
    });
    this.logger.log(
      `Mapping updated, code=${result.statusCode}, body=${JSON.stringify(
        result.body,
      )}`,
    );
    return result;
  }

  async insert(data: { id: string; content: string; filename: string }) {
    return this.elastic.index({
      index: 'dialogs',
      id: data.id,
      body: { content: data.content, filename: data.filename },
    });
  }

  async read(id: string) {
    return this.elastic.get({ index: 'dialogs', id });
  }

  async search(
    keyword: string,
    fields: ('content' | 'filename')[],
    from?: number,
    size?: number,
  ) {
    return this.elastic.search({
      index: 'dialogs',
      body: {
        from,
        size,
        query: { multi_match: { query: keyword, fields } },
        highlight: {
          type: 'plain',
          fields: Object.fromEntries(fields.map((value) => [value, {}])),
        },
      },
    });
  }

  async suggest(keyword: string, field: 'content' | 'filename') {
    return this.elastic.search({
      index: 'dialogs',
      body: { suggest: { suggest: { text: keyword, completion: { field } } } },
    });
  }

  async delete(id: string) {
    return this.elastic.delete({ index: 'dialogs', id });
  }
}

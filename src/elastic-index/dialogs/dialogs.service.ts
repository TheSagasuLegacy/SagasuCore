import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export interface DialogData {
  id: string;
  content: string;
}

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
          id: { type: 'keyword' },
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

  async insert(data: DialogData) {
    return this.elastic.index({
      index: 'dialogs',
      id: data.id,
      body: { content: data.content },
    });
  }

  async bulkInsert(data: DialogData[]) {
    return await this.elastic.helpers.bulk({
      datasource: data,
      onDocument: (doc) => ({ index: { _index: 'dialogs', _id: doc.id } }),
    });
  }

  async read(id: string) {
    return this.elastic.get({ index: 'dialogs', id });
  }

  async search(keyword: string, from?: number, size?: number) {
    return this.elastic.search({
      index: 'dialogs',
      body: {
        from,
        size,
        query: { match: { content: keyword } },
        highlight: {
          type: 'plain',
          fields: { content: {} },
        },
      },
    });
  }

  async suggest(keyword: string) {
    return this.elastic.search({
      index: 'dialogs',
      body: {
        suggest: {
          suggest: { text: keyword, completion: { field: 'content' } },
        },
      },
    });
  }

  async delete(id: string) {
    return this.elastic.delete({ index: 'dialogs', id });
  }
}

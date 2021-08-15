import { Injectable } from '@nestjs/common';
import { ElasticsearchService as ESService } from '@nestjs/elasticsearch';
import * as sysinfo from 'systeminformation';

@Injectable()
export class AppService {
  constructor(private readonly elastic: ESService) {}

  async getStatistics() {
    const speed = await sysinfo.cpuCurrentSpeed();
    const temperature = await sysinfo.cpuTemperature();
    const memory = await sysinfo.mem();
    const diskIO = await sysinfo.disksIO();
    const diskFS = await sysinfo.fsSize();
    const elasticInfo = await this.elastic.info();
    return {
      cpu: { speed, temperature },
      memory,
      disk: { io: diskIO, fs: diskFS },
      elastic: elasticInfo.body,
    };
  }
}

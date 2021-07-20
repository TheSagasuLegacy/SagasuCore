import { Test, TestingModule } from '@nestjs/testing';
import { SeriesIndexService } from './series.service';

describe('SeriesIndexService', () => {
  let service: SeriesIndexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeriesIndexService],
    }).compile();

    service = module.get<SeriesIndexService>(SeriesIndexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

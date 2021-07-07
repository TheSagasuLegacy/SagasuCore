import { Test, TestingModule } from '@nestjs/testing';
import { SeriesSearchService } from './series-search.service';

describe('SeriesSearchService', () => {
  let service: SeriesSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeriesSearchService],
    }).compile();

    service = module.get<SeriesSearchService>(SeriesSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

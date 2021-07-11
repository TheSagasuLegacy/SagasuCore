import { Test, TestingModule } from '@nestjs/testing';
import { DialogsSearchService } from './dialogs-search.service';

describe('DialogsSearchService', () => {
  let service: DialogsSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DialogsSearchService],
    }).compile();

    service = module.get<DialogsSearchService>(DialogsSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

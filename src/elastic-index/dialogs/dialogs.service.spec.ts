import { Test, TestingModule } from '@nestjs/testing';
import { DialogsIndexService } from './dialogs.service';

describe('DialogsIndexService', () => {
  let service: DialogsIndexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DialogsIndexService],
    }).compile();

    service = module.get<DialogsIndexService>(DialogsIndexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

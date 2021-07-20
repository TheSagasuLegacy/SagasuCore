import { Test, TestingModule } from '@nestjs/testing';
import { DialogQueueService } from './dialog-queue.service';

describe('DialogQueueService', () => {
  let service: DialogQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DialogQueueService],
    }).compile();

    service = module.get<DialogQueueService>(DialogQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

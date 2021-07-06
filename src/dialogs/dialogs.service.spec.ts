import { Test, TestingModule } from '@nestjs/testing';
import { DialogsService } from './dialogs.service';

describe('DialogsService', () => {
  let service: DialogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DialogsService],
    }).compile();

    service = module.get<DialogsService>(DialogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';

describe('DialogsController', () => {
  let controller: DialogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DialogsController],
      providers: [DialogsService],
    }).compile();

    controller = module.get<DialogsController>(DialogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MykantinController } from './mykantin.controller';

describe('MykantinController', () => {
  let controller: MykantinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MykantinController],
    }).compile();

    controller = module.get<MykantinController>(MykantinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

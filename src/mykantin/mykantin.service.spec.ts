import { Test, TestingModule } from '@nestjs/testing';
import { MykantinService } from './mykantin.service';

describe('MykantinService', () => {
  let service: MykantinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MykantinService],
    }).compile();

    service = module.get<MykantinService>(MykantinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

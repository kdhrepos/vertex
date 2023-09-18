import { Test, TestingModule } from '@nestjs/testing';
import { HashtagLinkService } from './hashtag-link.service';

describe('HashtagLinkService', () => {
  let service: HashtagLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashtagLinkService],
    }).compile();

    service = module.get<HashtagLinkService>(HashtagLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

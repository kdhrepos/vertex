import { Test, TestingModule } from '@nestjs/testing';
import { HashtagLinkController } from './hashtag-link.controller';

describe('HashtagLinkController', () => {
  let controller: HashtagLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashtagLinkController],
    }).compile();

    controller = module.get<HashtagLinkController>(HashtagLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

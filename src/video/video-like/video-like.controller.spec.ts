import { Test, TestingModule } from '@nestjs/testing';
import { VideoLikeController } from './video-like.controller';

describe('VideoLikeController', () => {
  let controller: VideoLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoLikeController],
    }).compile();

    controller = module.get<VideoLikeController>(VideoLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

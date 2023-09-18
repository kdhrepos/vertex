import { Test, TestingModule } from '@nestjs/testing';
import { VideoLikeService } from './video-like.service';

describe('VideoLikeService', () => {
  let service: VideoLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoLikeService],
    }).compile();

    service = module.get<VideoLikeService>(VideoLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

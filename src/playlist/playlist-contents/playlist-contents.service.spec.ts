import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistContentsService } from './playlist-contents.service';

describe('PlaylistContentsService', () => {
  let service: PlaylistContentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistContentsService],
    }).compile();

    service = module.get<PlaylistContentsService>(PlaylistContentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

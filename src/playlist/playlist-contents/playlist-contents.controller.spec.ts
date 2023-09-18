import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistContentsController } from './playlist-contents.controller';

describe('PlaylistContentsController', () => {
  let controller: PlaylistContentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistContentsController],
    }).compile();

    controller = module.get<PlaylistContentsController>(PlaylistContentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

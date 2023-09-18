import { Test, TestingModule } from '@nestjs/testing';
import { VideoRecordController } from './video-record.controller';

describe('VideoRecordController', () => {
  let controller: VideoRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoRecordController],
    }).compile();

    controller = module.get<VideoRecordController>(VideoRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { VideoRecordController } from './video-record.controller';
import { VideoRecordService } from './video-record.service';

@Module({
  controllers: [VideoRecordController],
  providers: [VideoRecordService]
})
export class VideoRecordModule {}

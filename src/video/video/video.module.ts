import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { DatabaseModule } from 'src/database/database.module';
import { videoProviders } from './video.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [VideoController],
  providers: [VideoService, ...videoProviders]
})
export class VideoModule {}

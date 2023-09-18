import { Module } from '@nestjs/common';
import { PlaylistContentsController } from './playlist-contents.controller';
import { PlaylistContentsService } from './playlist-contents.service';

@Module({
  controllers: [PlaylistContentsController],
  providers: [PlaylistContentsService]
})
export class PlaylistContentsModule {}

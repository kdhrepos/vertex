import { Module } from "@nestjs/common";

import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";
import { VideoLikeController } from "./video-like.controller";
import { VideoRecordController } from "./video-record.controller";
import { VideoLikeService } from "./video-like.service";
import { VideoRecordService } from "./video-record.service";

// Database
import { SequelizeModule } from "@nestjs/sequelize";
import { Video } from "src/models/video.model";

@Module({
	imports: [SequelizeModule.forFeature([Video])],
	controllers: [VideoController, VideoLikeController, VideoRecordController],
	providers: [VideoService, VideoLikeService, VideoRecordService],
})
export class VideoModule {}

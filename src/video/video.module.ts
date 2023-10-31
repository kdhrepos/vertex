import { Module } from "@nestjs/common";

import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";
import { VideoRecordService } from "./video-record.service";

import { VideoLikeService } from "./video-like.service";
import { VideoCommentService } from "./video-comment.service";

// Database
import { SequelizeModule } from "@nestjs/sequelize";
import { Video } from "src/model/video.model";

@Module({
	imports: [SequelizeModule.forFeature([Video])],
	controllers: [VideoController],
	providers: [
		VideoService,
		VideoLikeService,
		VideoRecordService,
		VideoCommentService,
	],
})
export class VideoModule {}

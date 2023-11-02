import {
	Controller,
	Get,
	Param,
	Post,
	Delete,
	Patch,
	Request,
	Response,
	UseInterceptors,
	UploadedFile,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { FileInterceptor } from "@nestjs/platform-express";
import { FirebaseService } from "src/firebase/firebase.service";

@ApiTags("Video")
@Controller("video")
export class VideoController {
	constructor(
		private videoService: VideoService,
		private firebaseService: FirebaseService,
	) {}

	// @ApiOperation({ description: "추천 알고리즘을 통한 비디오 요청" })
	// @Get("/")
	// async findVideosByAlgorithm() {}

	@ApiOperation({ description: "하나의 비디오 시청을 위해 비디오 요청" })
	@Get("watch/:video_id")
	async streamVideoById(
		@Request() req,
		@Response() res,
		@Param("video_id") video_id,
	) {
		return this.videoService.findOne(req, res, video_id);
	}

	@ApiOperation({
		description: "한 크리에이터의 채널에 들어갔을때 비디오 요청",
	})
	@Get("channel/:creator_id")
	async getChannelById() {}

	@ApiOperation({ description: "검색을 통해 비디오 요청" })
	@Get("search/:search_query")
	async findVideosBySearch(@Param("search_query") params) {
		return params;
	}

	@ApiOperation({ description: "비디오 업로드" })
	@UseInterceptors(FileInterceptor("video", {}))
	@Post("/create")
	async createVideo(@UploadedFile() video: Express.Multer.File) {
		console.log(video);
		return await this.firebaseService.uploadVideo("a", video);
	}

	@ApiOperation({ description: "비디오 수정" })
	@Patch("/:video_id")
	async updateVideo() {}

	@ApiOperation({ description: "비디오 삭제" })
	@Delete("/:video_id")
	async deleteVideo() {
		return "This deletes a video";
	}

	@ApiOperation({ description: "비디오 다운로드 요청" })
	@Get("/download/:video_id")
	async downloadVideo() {}

	@ApiOperation({ description: "비디오에 댓글 등록" })
	@Get("/comment/:video_id")
	async createCommentToVideo(@Param("video_id") params) {
		return params;
	}

	@ApiOperation({ description: "비디오에 댓글 수정" })
	@Patch("/comment/:video_id")
	async updateCommentToVideo(@Param("video_id") params) {
		return params;
	}

	@ApiOperation({ description: "비디오 좋아요/싫어요 누르기" })
	@Post("/like/:video_id")
	async likeToVideo(@Param("video_id") params) {
		return params;
	}
}

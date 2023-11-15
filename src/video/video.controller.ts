import {
	Controller,
	Get,
	Param,
	Post,
	Delete,
	Patch,
	Res,
	UseInterceptors,
	Body,
	UseGuards,
	UploadedFiles,
	Request,
	HttpException,
	HttpStatus,
	Query,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import {
	FileFieldsInterceptor,
	FileInterceptor,
} from "@nestjs/platform-express";
import { FirebaseService } from "src/firebase/firebase.service";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { UploadVideoDto } from "./dto/upload-video.dto";
import { FindVideoDto } from "./dto/find-video.dto";
import { DeleteVideoDto } from "./dto/delete-video.dto";
import { Response } from "express";

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
	@Get("watch")
	async streamVideoById(
		@Res() res: Response,
		@Query() findVideoDto: FindVideoDto,
	) {
		const { email, title } = findVideoDto;
		const video = await this.videoService.findOne(email, title);
		if (video) {
			return await this.firebaseService.findVideo(res, video);
		} else {
			return new HttpException("Video Does Not Exist", HttpStatus.BAD_REQUEST);
		}
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
	@UseGuards(AuthenticatedGuard)
	@UseInterceptors(
		FileFieldsInterceptor([{ name: "video" }, { name: "thumbnail" }]),
	)
	@Post("upload")
	async uploadVideo(
		@Body() uploadVideoDto: UploadVideoDto,
		@UploadedFiles()
		files: {
			video: Express.Multer.File[];
			thumbnail?: Express.Multer.File[];
		},
	) {
		if (
			!(await this.videoService.findOne(
				uploadVideoDto.email,
				uploadVideoDto.title,
			))
		) {
			return await this.firebaseService.uploadVideo(
				uploadVideoDto,
				files.video[0],
				files.thumbnail[0],
			);
		} else {
			return new HttpException(
				"Duplicated Video Title",
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@ApiOperation({ description: "비디오 수정" })
	@Patch("/:video_id")
	async updateVideo() {}

	@ApiOperation({ description: "비디오 삭제" })
	@UseGuards(AuthenticatedGuard)
	@Delete("/delete")
	async deleteVideo(@Body() deleteVideoDto: DeleteVideoDto) {
		const { email, title } = deleteVideoDto;
		const existedVideo = await this.videoService.findOne(email, title);
		if (existedVideo) {
			await this.videoService.deleteOne(email, title);
			return await this.firebaseService.deleteVideo(existedVideo);
		}
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

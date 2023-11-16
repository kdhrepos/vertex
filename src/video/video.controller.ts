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
	HttpException,
	HttpStatus,
	Query,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";

import {
	FileFieldsInterceptor,
	FileInterceptor,
} from "@nestjs/platform-express";
import { FirebaseService } from "src/firebase/firebase.service";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { Response } from "express";
import { generateId } from "src/generate-id";
import { FindVideoDto } from "./dto/video-dto/find-video.dto";
import { UploadVideoDto } from "./dto/video-dto/upload-video.dto";
import { UpdateVideoDto } from "./dto/video-dto/update-video.dto";
import { DeleteVideoDto } from "./dto/video-dto/delete-video.dto";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { VideoCommentService } from "./video-comment.service";
import { FindCommentDto } from "./dto/comment-dto/find-comment.dto";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";

@ApiTags("Video")
@Controller("video")
export class VideoController {
	constructor(
		private videoService: VideoService,
		private videoCommentService: VideoCommentService,
		private firebaseService: FirebaseService,
	) {}

	// @ApiOperation({ description: "추천 알고리즘을 통한 비디오 요청" })
	// @Get("/")
	// async findVideosByAlgorithm() {}

	@ApiOperation({ description: "하나의 비디오 시청을 위해 비디오 요청" })
	@Get("watch")
	async streamVideo(@Res() res: Response, @Query() findVideoDto: FindVideoDto) {
		const { path } = findVideoDto;
		const video = await this.videoService.findOne(path);
		if (video) {
			return await this.firebaseService.findVideo(res, video);
		} else {
			return new HttpException("Video Does Not Exist", HttpStatus.BAD_REQUEST);
		}
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
		const { email, title } = uploadVideoDto;
		const hashedFilePath = generateId(
			`${email}${title}${files.video[0].originalname}`,
		);

		if (!(await this.videoService.findOne(hashedFilePath))) {
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
	@UseGuards(AuthenticatedGuard)
	@UseInterceptors(
		FileFieldsInterceptor([{ name: "video" }, { name: "thumbnail" }]),
	)
	@Patch("/update")
	async updateVideo(
		@Body() updateVideoDto: UpdateVideoDto,
		@UploadedFiles()
		files: {
			video: Express.Multer.File[];
			thumbnail?: Express.Multer.File[];
		},
	) {
		const { path } = updateVideoDto;

		const videoData = await this.videoService.findOne(path);
		if (videoData) {
			this.videoService.updateOne(updateVideoDto);
			return await this.firebaseService.updateVideo(
				videoData,
				files.video[0],
				files.thumbnail[0],
			);
		} else {
			return new HttpException("Video Does Not Exist", HttpStatus.BAD_REQUEST);
		}
	}

	@ApiOperation({ description: "비디오 삭제" })
	@UseGuards(AuthenticatedGuard)
	@Delete("/delete")
	async deleteVideo(@Body() deleteVideoDto: DeleteVideoDto) {
		const { email, title, path } = deleteVideoDto;
		const existedVideo = await this.videoService.findOne(path);
		if (existedVideo) {
			await this.videoService.deleteOne(path, email, title);
			return await this.firebaseService.deleteVideo(existedVideo);
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

	@ApiOperation({ description: "비디오 다운로드 요청" })
	@Get("/download")
	async downloadVideo(@Query() findVideoDto: FindVideoDto) {
		const { path } = findVideoDto;
		if (await this.videoService.findOne(path)) {
			return await this.firebaseService.downloadVideo(findVideoDto);
		} else {
			return new HttpException(
				"Video Download Error",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@ApiOperation({ description: "특정 비디오의 댓글 가져오기" })
	@Get("comment")
	async getCommentFromVideo(@Query() findCommentDto: FindCommentDto) {
		return await this.videoCommentService.findAll(findCommentDto);
	}

	@ApiOperation({ description: "비디오에 댓글 등록" })
	@Post("comment")
	async createCommentToVideo(@Body() uploadCommentDto: UploadCommentDto) {
		return await this.videoCommentService.create(uploadCommentDto);
	}

	@ApiOperation({ description: "비디오에 댓글 수정" })
	@UseGuards(AuthenticatedGuard)
	@Patch("comment")
	async updateCommentToVideo(@Body() updateCommentDto: UpdateCommentDto) {
		return await this.videoCommentService.update(updateCommentDto);
	}

	@ApiOperation({ description: "비디오 좋아요/싫어요 누르기" })
	@Post("/like/:video_id")
	async likeToVideo(@Param("video_id") params) {
		return params;
	}
}

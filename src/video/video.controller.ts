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
	Session,
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
import { VideoRecordService } from "./video-record.service";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";
import { session } from "passport";
import { VideoLikeService } from "./video-like.service";

@ApiTags("Video")
@Controller("video")
export class VideoController {
	constructor(
		private videoService: VideoService,
		private videoCommentService: VideoCommentService,
		private videoRecordService: VideoRecordService,
		private videoLikeService: VideoLikeService,
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
			// 조회수 갱신, 비디오 기록 후 비디오 스트리밍
			this.videoService.updateView(video);
			this.videoRecordService.create(video);
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
		@Session() session,
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
		@Session() session,
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
	async deleteVideo(
		@Body() deleteVideoDto: DeleteVideoDto,
		@Session() session,
	) {
		const { email, title, path } = deleteVideoDto;
		const existedVideo = await this.videoService.findOne(path); // 여기에서 find해서 존재하면 삭제를 진행하는데 Service에 deleteOne에서 또 존재하는지 보는게 조금 비효율적인거같음.
		if (existedVideo) {
			await this.videoService.deleteOne(path, email, title);
			return await this.firebaseService.deleteVideo(existedVideo);
		}
	}

	@ApiOperation({ description: "비디오 다운로드 요청" })
	@Get("/download")
	async downloadVideo(
		@Res() res: Response,
		@Query() findVideoDto: FindVideoDto,
		@Session() session,
	) {
		const { path } = findVideoDto;
		const existedVideo = await this.videoService.findOne(path);
		if (existedVideo) {
			const downloadURL =
				await this.firebaseService.downloadVideo(existedVideo);
			return res.redirect(downloadURL);
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
	async createCommentToVideo(
		@Body() uploadCommentDto: UploadCommentDto,
		@Session() session,
	) {
		return await this.videoCommentService.create(uploadCommentDto);
	}

	@ApiOperation({ description: "비디오 댓글 수정" })
	@UseGuards(AuthenticatedGuard)
	@Patch("comment")
	async updateCommentToVideo(
		@Body() updateCommentDto: UpdateCommentDto,
		@Session() session,
	) {
		return await this.videoCommentService.update(updateCommentDto);
	}

	@ApiOperation({ description: "비디오 댓글 삭제" })
	@UseGuards(AuthenticatedGuard)
	@Delete("comment")
	async deleteCommentToVideo(
		@Body() deleteCommentDto: DeleteCommentDto,
		@Session() session,
	) {
		return await this.videoCommentService.delete(deleteCommentDto);
	}

	@ApiOperation({ description: "비디오 좋아요/싫어요 누르기" })
	@UseGuards(AuthenticatedGuard)
	@Post("/like")
	async likeToVideo(@Body("path") path: string, @Session() session: any) {
		const video = await this.videoService.findOne(path);

		if (video) {
			const liked = await this.videoLikeService.create(path, session);
			this.videoService.updateLike(path, video, liked);
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
}

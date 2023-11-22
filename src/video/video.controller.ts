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
import { UploadVideoDto } from "./dto/video-dto/upload-video.dto";
import { UpdateVideoDto } from "./dto/video-dto/update-video.dto";
import { DeleteVideoDto } from "./dto/video-dto/delete-video.dto";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { VideoCommentService } from "./video-comment.service";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { VideoRecordService } from "./video-record.service";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";
import { VideoLikeService } from "./video-like.service";
import * as path from "path";
import * as bcrypt from "bcrypt";

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
	async streamVideo(@Res() res: Response, @Query("videoId") videoId: string) {
		const video = await this.videoService.findOne(videoId);
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
	@Post("")
	async uploadVideo(
		@Body() uploadVideoDto: UploadVideoDto,
		@UploadedFiles()
		files: {
			video: Express.Multer.File[];
			thumbnail?: Express.Multer.File[];
		},
		@Session() session: any,
	) {
		const { user: email } = session.passport;
		const { title, description } = uploadVideoDto;
		const hashedFilePath = bcrypt
			.hashSync(`${email}${title}`, 12)
			.replace(/\//g, "");

		if (!(await this.videoService.findOne(hashedFilePath))) {
			// 메타 데이터를 DB에 저장
			await this.videoService.create(
				hashedFilePath,
				title,
				description,
				email,
				path.extname(files.video[0].originalname),
				path.extname(files.thumbnail[0].originalname),
			);
			// 비디오 업로드
			return await this.firebaseService.uploadVideo(
				session,
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
	@Patch("")
	async updateVideo(
		@Body() updateVideoDto: UpdateVideoDto,
		@UploadedFiles()
		files: {
			video: Express.Multer.File[];
			thumbnail?: Express.Multer.File[];
		},
		@Session() session,
	) {
		const { videoId } = updateVideoDto;

		const videoData = await this.videoService.findOne(videoId);
		if (videoData) {
			this.videoService.updateOne(updateVideoDto, session);
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
	@Delete("")
	async deleteVideo(
		@Body() deleteVideoDto: DeleteVideoDto,
		@Session() session: any,
	) {
		const { videoId } = deleteVideoDto;
		const existedVideo = await this.videoService.findOne(videoId);
		if (existedVideo) {
			await this.videoService.deleteOne(deleteVideoDto, session);
			return await this.firebaseService.deleteVideo(existedVideo);
		} else {
			return new HttpException(
				`Video Does Not Exist`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@ApiOperation({ description: "비디오 다운로드 요청" })
	@Get("/download")
	async downloadVideo(@Res() res: Response, @Query("videoId") videoId: string) {
		const existedVideo = await this.videoService.findOne(videoId);
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
	async getCommentFromVideo(@Query("videoId") videoId: string) {
		return await this.videoCommentService.findAll(videoId);
	}

	@ApiOperation({ description: "비디오에 댓글 등록" })
	@UseGuards(AuthenticatedGuard)
	@Post("comment")
	async createCommentToVideo(
		@Body() uploadCommentDto: UploadCommentDto,
		@Session() session: any,
	) {
		return await this.videoCommentService.create(uploadCommentDto, session);
	}

	@ApiOperation({ description: "비디오 댓글 수정" })
	@UseGuards(AuthenticatedGuard)
	@Patch("comment")
	async updateCommentToVideo(@Body() updateCommentDto: UpdateCommentDto) {
		return await this.videoCommentService.update(updateCommentDto);
	}

	@ApiOperation({ description: "비디오 댓글 삭제" })
	@UseGuards(AuthenticatedGuard)
	@Delete("comment")
	async deleteCommentToVideo(
		@Body() deleteCommentDto: DeleteCommentDto,
		@Session() session,
	) {
		return await this.videoCommentService.delete(deleteCommentDto, session);
	}

	@ApiOperation({ description: "비디오 좋아요/싫어요 누르기" })
	@UseGuards(AuthenticatedGuard)
	@Post("/like")
	async likeToVideo(
		@Body("videoId,") videoId: string,
		@Session() session: any,
	) {
		const video = await this.videoService.findOne(videoId);

		if (video) {
			const liked = await this.videoLikeService.create(videoId, session);
			this.videoService.updateLike(video, liked);
		} else {
			return new HttpException("Video Does Not Exist", HttpStatus.BAD_REQUEST);
		}
	}

	@ApiOperation({
		description: "한 크리에이터의 채널에 들어갔을때 비디오 요청",
	})
	@Get("list")
	async getChannelVideoList(@Query("channelId") channelId: string) {
		return await this.videoService.findAll(channelId);
	}

	@ApiOperation({ description: "검색을 통해 비디오 요청" })
	@Get("search/:search_query")
	async findVideosBySearch(@Param("search_query") params) {
		return params;
	}
}

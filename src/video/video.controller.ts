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
	Req,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";

import {
	FileFieldsInterceptor,
	FileInterceptor,
} from "@nestjs/platform-express";
import { FirebaseService } from "src/firebase/firebase.service";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { Request, Response } from "express";
import { UploadVideoDto } from "./dto/video-dto/upload-video.dto";
import { UpdateVideoDto } from "./dto/video-dto/update-video.dto";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { VideoCommentService } from "./video-comment.service";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { VideoRecordService } from "./video-record.service";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";
import { VideoLikeService } from "./video-like.service";
import * as path from "path";
import * as bcrypt from "bcrypt";
import { VideoRecommendService } from "./video-recommend.service";

@ApiTags("Video")
@Controller("video")
export class VideoController {
	constructor(
		private videoService: VideoService,
		private videoCommentService: VideoCommentService,
		private videoRecordService: VideoRecordService,
		private videoLikeService: VideoLikeService,
		private videoRecommendService:VideoRecommendService,
		private firebaseService: FirebaseService,
	) { }

	@ApiOperation({ description: "추천 알고리즘을 통한 비디오 요청" })
	@Get("home")
	async findVideosByAlgorithm() {
		return await this.videoService.homepage();
	}

	@ApiOperation({ description: "하나의 비디오 시청을 위해 비디오 요청" })
	@Get("watch")
	async streamVideo(
		@Res() res: Response,
		@Query("videoId") videoId: string,
		@Query("videoFileExtension") videoFileExtension:string,
		@Query("email") email?: string,
		// @Query("isYoutube") isYoutube : boolean,
	) {
			// 조회수 갱신, 비디오 기록 후 비디오 스트리밍
			this.videoService.updateView(videoId);
			if (email) this.videoRecordService.create(videoId, email);

			const videoPath = videoId + videoFileExtension;
			const videoUrl = await this.firebaseService.findVideo(videoPath);
			console.log("video/watch", videoUrl);
			return res.send(videoUrl);
	}

	@ApiOperation({ description: "비디오 메타 데이터 요청" })
	@Get("data")
	async getVideoData(@Res() res: Response, @Query("videoId") videoId: string) {
		const videoData = await this.videoService.findOne(videoId);

		if (videoData) {
			return res.json({
				data: videoData,
				statusCode: 200,
				message: "Video is successfully found",
			});
		}

		return res.json({
			statusCode: 404,
			message: "Video not found",
		});
	}

	@ApiOperation({ description: "비디오 썸네일 요청" })
	@Get("thumbnail")
	async getThumbnail(
		@Res() res: Response,
		@Query("videoId") videoId: string,
		@Query("thumbnailFileExtension") thumbnailFileExtension: string,
	) {
		const thumbnailPath = videoId + thumbnailFileExtension;
		const imgUrl = await this.firebaseService.findImage(thumbnailPath);
		if (imgUrl) {
			return res.send(imgUrl);
		}
		return res.send("./defaultImg.png");
	}

	@ApiOperation({ description: "비디오 업로드" })
	@Post("")
	@UseInterceptors(
		FileFieldsInterceptor([{ name: "video" }, { name: "thumbnail" }]),
	)
	async uploadVideo(
		@Res() res: Response,
		@Body() uploadVideoDto: UploadVideoDto,
		@UploadedFiles()
		files: {
			video: Express.Multer.File[];
			thumbnail?: Express.Multer.File[];
		},
	) {
		const { email, title, description } = uploadVideoDto;
		// 비디오 ID 및 파이어 베이스 내 파일 경로 생성
		const hashedFilePath = bcrypt
			.hashSync(`${email}${title}`, 12)
			.replace(/\//g, "");

		// 메타 데이터를 DB에 저장
		this.videoService.create(
			hashedFilePath,
			title,
			description,
			email,
			path.extname(files.video[0].originalname),
			path.extname(files.thumbnail[0].originalname),
		);
		// 썸네일 업로드
		if (files.thumbnail[0])
			this.firebaseService.uploadImage(
				files.thumbnail[0],
				hashedFilePath + path.extname(files.thumbnail[0].originalname),
			);
		// 비디오 업로드
		const result = await this.firebaseService.uploadVideo(
			hashedFilePath,
			files.video[0],
		);
		return res.send(result);
	}

	@ApiOperation({ description: "비디오 수정" })
	@Patch("")
	@UseInterceptors(
		FileFieldsInterceptor([{ name: "video" }, { name: "thumbnail" }]),
	)
	async updateVideo(
		@Res() res: Response,
		@Body() updateVideoDto: UpdateVideoDto,
		@UploadedFiles()
		files: {
			video: Express.Multer.File[];
			thumbnail?: Express.Multer.File[];
		},
	) {
		const { email, videoId } = updateVideoDto;

		const videoData = await this.videoService.findOne(videoId);

		this.videoService.updateOne(updateVideoDto, email);

		let thumbnailResult = null;
		let videoResult = null;

		if (files.thumbnail)
			thumbnailResult = await this.firebaseService.uploadImage(
				files.thumbnail[0],
				videoData.id,
			);

		if (files.video)
			videoResult = await this.firebaseService.updateVideo(
				videoData,
				files.video[0],
			);

		return res.json({
			thumbnailResult,
			videoResult,
		});
	}

	@ApiOperation({ description: "비디오 삭제" })
	@Delete("")
	async deleteVideo(
		@Res() res: Response,
		@Query("videoId") videoId: string,
		@Query("email") email: string,
	) {
		const video = await this.videoService.deleteOne(videoId, email);
		const result = await this.firebaseService.deleteVideo(video);
		return res.send(result);
	}

	@ApiOperation({ description: "비디오 다운로드 요청" })
	@Get("/download")
	async downloadVideo(@Res() res: Response, @Query("videoId") videoId: string) {
		const existedVideo = await this.videoService.findOne(videoId);
		const downloadURL = await this.firebaseService.downloadVideo(existedVideo);
		return res.redirect(downloadURL);
	}

	@ApiOperation({ description: "특정 비디오의 댓글 가져오기" })
	@Get("comment")
	async getCommentFromVideo(@Query("videoId") videoId: string) {
		return await this.videoCommentService.findAll(videoId);
	}

	@ApiOperation({ description: "비디오에 댓글 등록" })
	@Post("comment")
	async createCommentToVideo(@Body() uploadCommentDto: UploadCommentDto) {
		return await this.videoCommentService.create(uploadCommentDto);
	}

	@ApiOperation({ description: "비디오 댓글 수정" })
	@Patch("comment")
	async updateCommentToVideo(@Body() updateCommentDto: UpdateCommentDto) {
		return await this.videoCommentService.update(updateCommentDto);
	}

	@ApiOperation({ description: "비디오 댓글 삭제" })
	@Delete("comment")
	async deleteCommentToVideo(@Body() deleteCommentDto: DeleteCommentDto) {
		return await this.videoCommentService.delete(deleteCommentDto);
	}

	@ApiOperation({ description: "하나의 비디오에 좋아요 눌렀는지 체크" })
	@Get("like/check")
	async checkLikeToVideo(
		@Query("videoId") videoId: string,
		@Query("email") email: string,
	) {
		return await this.videoLikeService.findOne(email, videoId);
	}

	@ApiOperation({ description: "유저가 좋아요 누른 비디오 리스트 가져오기" })
	@Get("like/list")
	async getLikeList(@Query("email") email: string) {
		console.log(email);
		return await this.videoLikeService.findAll(email);
	}

	@ApiOperation({ description: "비디오 좋아요/싫어요 누르기" })
	@Post("like")
	async likeToVideo(
		@Body("videoId") videoId: string,
		@Body("email") email: string,
	) {
		const isLiked = await this.videoLikeService.create(videoId, email);
		return await this.videoService.updateLike(videoId, isLiked);
	}

	@ApiOperation({
		description: "한 크리에이터의 채널에 들어갔을때 비디오 요청",
	})
	@Get("/channel/list")
	async getVideoListInChannel(@Query("channelId") channelId: string) {
		return await this.videoService.findAll(channelId);
	}

	@ApiOperation({
		description: "비디오 시청 기록 리스트 요청",
	})
	@Get("record")
	async getRecordList(@Req() req: Request, @Query("email") email: string) {
		console.log(email);
		return await this.videoRecordService.findAll(email);
	}

	@ApiOperation({
		description: "비디오 시청 기록 삭제",
	})
	@Delete("record")
	async deleteRecord(
		@Query("email") email: string,
		@Query("videoId") videoId: string,
	) {
		console.log(email, videoId);
		return await this.videoRecordService.delete(email, videoId);
	}

	@ApiOperation({ description: "검색을 통해 비디오 요청" })
	@Get("search")
	async findVideosBySearch(@Query("history") params: string): Promise < string > {
		return await this.videoRecommendService.sendMessage(params);
	}
}

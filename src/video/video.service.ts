import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { UpdateVideoDto } from "./dto/video-dto/update-video.dto";
import { Like } from "src/model/like.model";
import { VideoLikeService } from "./video-like.service";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
		@InjectModel(Like)
		private likeModel: typeof Like,
	) {}

	private readonly logger = new Logger("Video Service");

	async findAll(userId: string) {}

	async findOne(videoId: string): Promise<any> {
		const functionName = VideoService.prototype.findOne.name;
		try {
			const existedVideo = await this.videoModel.findByPk(videoId, {
				raw: true,
			});
			if (existedVideo) {
				return existedVideo;
			}
			this.logger.error(`${functionName} : Video Does Not Exist`);
			return false;
		} catch (error) {
			this.logger.error(`${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(
		videoId: string,
		title: string,
		description: string,
		email: string,
		videoFileExtension: string,
		thumbnailFileExtension: string,
	) {
		const functionName = VideoService.prototype.create.name;
		try {
			return this.videoModel.create({
				file_path: videoId,
				title: title,
				description: description === null ? null : description,
				user_email: email,
				video_file_extension: videoFileExtension,
				thumbnail_file_extension: thumbnailFileExtension,
			});
		} catch (error) {
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateOne(updateVideoDto: UpdateVideoDto) {
		const functionName = VideoService.prototype.updateOne.name;
		try {
			const { email, title, description, videoId } = updateVideoDto;
			await this.videoModel.update(
				{ user_email: email, title: title, description: description },
				{
					where: {
						file_path: videoId,
						user_email: email,
						title: title,
					},
				},
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteOne(videoId: string, email: string, title: string) {
		const functionName = VideoService.prototype.deleteOne.name;
		try {
			const existedVideo = await this.videoModel.findOne({
				where: {
					file_path: videoId,
					user_email: email,
					title: title,
				},
			});
			if (existedVideo) {
				await existedVideo.destroy();
				return;
			}
			this.logger.error(`${functionName} : Video Does Not Exist`);
			return new HttpException(
				`${functionName} : Video Does Not Exist`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateView(video: Video) {
		const functionName = VideoService.prototype.updateView.name;
		try {
			const { file_path: videoId, view_count: viewCount } = video;
			await this.videoModel.update(
				{ view_count: viewCount + 1 },
				{
					where: {
						file_path: videoId,
					},
				},
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateLike(video: Video, liked: any) {
		const functionName = VideoService.prototype.updateLike.name;
		try {
			const { file_path: filePath, like_count: likeCount } = video;
			await this.videoModel.update(
				// 좋아요를 누르지 않았다면 +1, 좋아요를 눌렀었다면 취소이므로 -1
				{ like_count: liked ? likeCount + 1 : likeCount - 1 },
				{
					where: {
						file_path: filePath,
					},
				},
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

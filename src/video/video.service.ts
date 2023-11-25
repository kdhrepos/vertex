import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { UpdateVideoDto } from "./dto/video-dto/update-video.dto";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
	) {}

	async findAll(channelId: string) {
		try {
			const videos = await this.videoModel.findAll({
				where: {
					user_email: channelId,
				},
			});

			return {
				data: videos,
				statusCode: 200,
				message: "Videos are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findOne(videoId: string): Promise<any> {
		try {
			const existedVideo = await this.videoModel.findByPk(videoId, {
				raw: true,
			});
			if (existedVideo) {
				return existedVideo;
			}
			return false;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
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
		try {
			return this.videoModel.create({
				id: videoId,
				title: title,
				description: description === null ? null : description,
				user_email: email,
				video_file_extension: videoFileExtension,
				thumbnail_file_extension: thumbnailFileExtension,
			});
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateOne(updateVideoDto: UpdateVideoDto, session: any) {
		const functionName = VideoService.prototype.updateOne.name;
		try {
			const { user: email } = session.passport;

			const { title, description, videoId } = updateVideoDto;
			await this.videoModel.update(
				{ user_email: email, title: title, description: description },
				{
					where: {
						id: videoId,
						user_email: email,
						title: title,
					},
				},
			);
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteOne(videoId: string, session: any) {
		try {
			const { user: email } = session.passport;

			const video = await this.videoModel.findOne({
				where: {
					id: videoId,
					user_email: email,
				},
			});

			if (video) {
				await video.destroy();
			}
			return video;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateView(video: Video) {
		try {
			const { id: videoId, view_count: viewCount } = video;
			await this.videoModel.update(
				{ view_count: viewCount + 1 },
				{
					where: {
						id: videoId,
					},
				},
			);
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateLike(video: Video, liked: any) {
		const functionName = VideoService.prototype.updateLike.name;
		try {
			const { id: videoId, like_count: likeCount } = video;
			await this.videoModel.update(
				// 좋아요를 누르지 않았다면 +1, 좋아요를 눌렀었다면 취소이므로 -1
				{ like_count: liked ? likeCount + 1 : likeCount - 1 },
				{
					where: {
						id: videoId,
					},
				},
			);
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { UploadVideoDto } from "./dto/video-dto/upload-video.dto";
import { UpdateVideoDto } from "./dto/video-dto/update-video.dto";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
	) {}

	private readonly logger = new Logger("Video Service");

	async findOne(videoPath: string): Promise<any> {
		const functionName = VideoService.prototype.findOne.name;
		try {
			const existedVideo = await this.videoModel.findByPk(videoPath, {
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

	async findAll(userId: string) {}

	async create(
		videoPath: string,
		title: string,
		description: string,
		email: string,
		videoFileExtension: string,
		thumbnailFileExtension: string,
	) {
		const functionName = VideoService.prototype.create.name;
		try {
			return this.videoModel.create({
				file_path: videoPath,
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
			const { email, title, description, path } = updateVideoDto;
			await this.videoModel.update(
				{ user_email: email, title: title, description: description },
				{
					where: {
						file_path: path,
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

	async deleteOne(videoPath: string, email: string, title: string) {
		const functionName = VideoService.prototype.deleteOne.name;
		try {
			const existedVideo = await this.videoModel.findOne({
				where: {
					file_path: videoPath,
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
			const { file_path: filePath, view_count: viewCount } = video;
			await this.videoModel.update(
				{ view_count: viewCount + 1 },
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

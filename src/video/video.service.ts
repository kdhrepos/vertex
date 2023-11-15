import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { UploadVideoDto } from "./dto/upload-video.dto";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
	) {}

	private readonly logger = new Logger("Video Service");

	async findOne(email: string, title: string): Promise<any> {
		const functionName = VideoService.prototype.findOne.name;
		try {
			const existedVideo = await this.videoModel.findOne({
				where: {
					user_email: email,
					title: title,
				},
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

	async updateOne(uploadVideoDto: UploadVideoDto) {
		const functionName = VideoService.prototype.updateOne.name;
		try {
			const { email, title, description } = uploadVideoDto;
			await this.videoModel.update(
				{ user_email: email, title: title, description: description },
				{
					where: {
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

	async deleteOne(email: string, title: string) {
		const functionName = VideoService.prototype.deleteOne.name;
		try {
			const existedVideo = await this.videoModel.findOne({
				where: {
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
}

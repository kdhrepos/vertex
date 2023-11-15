import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Video } from "../model/video.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(Video)
		private videoModel: typeof Video,
	) {}

	private readonly logger = new Logger("Video Service");

	/**
	 *
	 * @param req
	 * @param res
	 * @param videoId
	 * @description 비디오 id를 통해 하나의 비디오를 찾음
	 */
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

	/**
	 * @param userId
	 * @description 사용자 id를 통해 그 사용자가 업로드한 비디오들을 찾음
	 */
	async findAll(userId: string) {}

	/**
	 * @param userId
	 * @param videoFile
	 */
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
			this.videoModel.create({
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

	/**
	 * @param userId
	 * @param videoId
	 * @param videoInfo // 비디오 메타 데이터
	 */
	async update(userId: string, videoId: string, videoInfo: any) {}

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

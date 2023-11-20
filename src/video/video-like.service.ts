import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "src/model/like.model";

@Injectable()
export class VideoLikeService {
	constructor(
		@InjectModel(Like)
		private likeModel: typeof Like,
	) {}

	private readonly logger = new Logger("Video Like Service");

	/**
	 * @description 비디오에 좋아요 버튼을 누름
	 */

	async findAll(email: string, videoId: string) {
		const functionName = VideoLikeService.prototype.findAll.name;
		try {
			const existedRecord = await this.likeModel.findOne({
				where: {
					user_email: email,
					video_id: videoId,
				},
			});
			if (existedRecord) {
				return existedRecord;
			}
			return false;
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(videoId: string, session: any) {
		const functionName = VideoLikeService.prototype.create.name;
		try {
			const { user: email } = session.passport;

			const existedRecord = await this.likeModel.findOne({
				where: {
					user_email: email,
					video_id: videoId,
				},
			});

			if (existedRecord) {
				await existedRecord.destroy();
				return false;
			}
			await this.likeModel.create({
				user_email: email,
				video_id: videoId,
			});
			return true;
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

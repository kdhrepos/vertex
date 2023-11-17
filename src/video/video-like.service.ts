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

	async findAll(email: string, path: string) {
		const functionName = VideoLikeService.prototype.findAll.name;
		try {
			const existedRecord = await this.likeModel.findOne({
				where: {
					user_email: email,
					video_id: path,
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

	async create(path: string, session: any) {
		const functionName = VideoLikeService.prototype.create.name;
		try {
			const { passport } = session;
			// console.log(passport.user, path);

			const existedRecord = await this.likeModel.findOne({
				where: {
					user_email: passport.user,
					video_id: path,
				},
			});

			if (existedRecord) {
				await existedRecord.destroy();
				return false;
			}
			await this.likeModel.create({
				user_email: passport.user,
				video_id: path,
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

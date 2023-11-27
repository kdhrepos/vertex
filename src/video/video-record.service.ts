import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Record } from "src/model/record.model";
import { Video } from "src/model/video.model";

@Injectable()
export class VideoRecordService {
	constructor(
		@InjectModel(Record)
		private recordModel: typeof Record,
	) {}

	async findAll(email: string) {
		try {
			const records = await this.recordModel.findAll({
				where: {
					user_email: email,
				},
				include: [
					{
						model: Video,
						as: "video",
					},
				],
			});

			return {
				data: records,
				statusCode: 200,
				message: "Records are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async create( videoId: string, userId: string) {
		try {
			console.log(videoId,userId)
			const existedRecord = await this.recordModel.findOne({
				where: {
					user_email: userId,
					video_id: videoId,
				},
			});

			if (existedRecord) {
				return;
			}

			await this.recordModel.create({
				user_email: userId,
				video_id: videoId,
			});
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @param userId
	 * @param videoId
	 * @description 유저가 시청 목록에서 비디오 삭제
	 */
	async delete(userId: string, videoId: string) {}
}

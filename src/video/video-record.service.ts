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
				order:[['createdAt','DESC']]
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

	async create(videoId: string, userId: string) {
		try {
			console.log(videoId, userId);
			const record = await this.recordModel.findOne({
				where: {
					user_email: userId,
					video_id: videoId,
				},
			});

			if (record) {
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

	async delete(email: string, videoId: string) {
		try {
			await this.recordModel.destroy({
				where: {
					user_email: email,
					video_id: videoId,
				},
			});

			return {
				statusCode: 200,
				message: "Record is successfully deleted",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Like } from "src/model/like.model";

@Injectable()
export class VideoLikeService {
	constructor(
		@InjectModel(Like)
		private likeModel: typeof Like,
	) {}

	async findAll(email: string) {
		try {
			const record = await this.likeModel.findOne({
				where: {
					user_email: email,
					video_id: {
						[Op.not]: null,
					},
				},
			});
			if (record) {
				return record;
			}
			return false;
		} catch (error) {
			throw new HttpException(
				`${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findOne(userId : string, videoId: string){
		try {
			const record = await this.likeModel.findOne({
				where: {
					user_email: userId,
					video_id: videoId
				},
			});
			if (record) {
				return true;
			}
			return false;
		} catch (error) {
			throw new HttpException(
				`${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(videoId: string, email: string) {
		try {
			console.log(videoId, email)
			const existedRecord = await this.likeModel.findOne({
				where: {
					user_email: email,
					video_id: videoId,
				},
			}).catch((err)=>
			{console.log(err)})
			if (existedRecord) {
				await existedRecord.destroy();
				return false;
			}
			await this.likeModel.create({
				user_email: email,		
				video_id: videoId,
			}).catch((err)=>
			{console.log(err)})
			return true;
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

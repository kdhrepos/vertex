import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Like } from "src/model/like.model";
import { Post } from "src/model/post.model";

@Injectable()
export class PostLikeService {
	constructor(
		@InjectModel(Like)
		private postModel: typeof Post,

		@InjectModel(Like)
		private likeModel: typeof Like,
	) {}

	async findAll(userId : string){
		try {
			const record = await this.likeModel.findAll({
				where: {
					user_email: userId,
					post_id: {
						[Op.not]: null,
					},
				},
			});

			return {	
				data : record,
				statusCode: 200,
				message: "Post like successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findOne(userId : string, postId: string){
		try {
			const record = await this.likeModel.findOne({
				where: {
					user_email: userId,
					post_id: postId
				},
			});
			
			if (record) {
				return {	
					data : record,
					statusCode: 200,
					message: "Post like successfully found",
				};
			}
			
			return false;
		} catch (error) {
			throw new HttpException(
				`${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(postId: number, userId:string) {
		try {
			const post = await this.postModel.findByPk(postId);

			post.like_count++;
			post.save();

			this.likeModel.create({
				user_email: userId,
				post_id : postId,
			});
			return {
				statusCode: 200,
				message: "Post like successfully updated",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

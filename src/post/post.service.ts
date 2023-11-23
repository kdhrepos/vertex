import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { CreatePostDto } from "./dto/post-dto/create-post.dto";
import { UpdatePostDto } from "./dto/post-dto/update-post.dto";

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post)
		private postModel: typeof Post,
	) {}

	private readonly logger = new Logger("Post Service");

	async findAll(channelId: string) {
		const functionName = PostService.prototype.findAll.name;
		try {
			return await this.postModel.findAll({
				where: {
					channel_email: channelId,
				},
				raw: true,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findOne(postId: number, channelId: string) {
		const functionName = PostService.prototype.findOne.name;
		try {
			const existedPost = await this.postModel.findOne({
				where: {
					id: postId,
					channel_email: channelId,
				},
				attributes: [
					"id",
					"title",
					"contents",
					"like_count",
					"view_count",
					"image_file_path",
					"createdAt",
					"updatedAt",
				],
				raw: true,
			});

			this.postModel.update(
				{
					view_count: existedPost.view_count + 1,
				},
				{
					where: {
						id: postId,
						channel_email: channelId,
					},
				},
			);

			return existedPost;
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async create(createPostDto: CreatePostDto, imgPath: string, session: any) {
		const functionName = PostService.prototype.create.name;
		try {
			const { channelId, title, contents } = createPostDto;
			const { user: email } = session.passport;

			await this.postModel.create({
				user_email: email,
				channel_email: channelId,
				title: title,
				contents: contents,
				image_file_path: imgPath,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async update(updatePostDto: UpdatePostDto) {
		const functionName = PostService.prototype.update.name;
		try {
			const { postId, title, contents } = updatePostDto;

			this.postModel.update(
				{
					title: title,
					contents: contents,
				},
				{
					where: {
						id: postId,
					},
				},
			);

			return await this.postModel.findOne({
				where: {
					id: postId,
				},
				raw: true,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(postId: string, session: any) {
		const functionName = PostService.prototype.delete.name;
		try {
			const { user } = session.passport;

			this.postModel.destroy({
				where: {
					id: postId,
					user_email: user,
				},
			});

			return await this.postModel.findOne({
				where: {
					id: postId,
				},
				raw: true,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

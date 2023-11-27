import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { CreatePostDto } from "./dto/post-dto/create-post.dto";
import { UpdatePostDto } from "./dto/post-dto/update-post.dto";
import { User } from "src/model/user.model";

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post)
		private postModel: typeof Post,
	) {}

	async findNewPosts() {
		try {
			const posts = await this.postModel.findAll({
				raw: true,
				order: [["createdAt", "DESC"]],
				include: [
					{
						model: User,
						as: "user",
						attributes: ["name"],
					},
				],
			});

			return {
				data: posts,
				statusCode: 200,
				message: "Newest posts are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findAll(channelId: string) {
		try {
			const posts = await this.postModel.findAll({
				where: {
					channel_email: channelId,
				},
				raw: true,
				include: [
					{
						model: User,
						as: "user",
						attributes: ["name"],
					},
				],
			});

			return {
				data: posts,
				statusCode: 200,
				message: "Posts are successfully found",
			};
		} catch (error) {
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
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(createPostDto: CreatePostDto, imgPath: string) {
		try {
			const { channelId, title, contents, email } = createPostDto;

			const post = await this.postModel.create({
				user_email: email,
				channel_email: channelId,
				title: title,
				contents: contents,
				image_file_path: imgPath,
			});

			return {
				data: post,
				statusCode: 200,
				message: "Post successfully uploaded",
			};
		} catch (error) {
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
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async delete(postId: string, email: string) {
		const functionName = PostService.prototype.delete.name;
		try {
			this.postModel.destroy({
				where: {
					id: postId,
					user_email: email,
				},
			});

			return await this.postModel.findOne({
				where: {
					id: postId,
				},
				raw: true,
			});
		} catch (error) {
			throw new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

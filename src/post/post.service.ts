import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { generateId } from "src/generate-id";
import { CreatePostDto } from "./dto/create-post.dto";
import { FindPostDto } from "./dto/find-post.dto";
import { DeletePostDto } from "./dto/delete-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post)
		private postModel: typeof Post,
	) {}

	private readonly logger = new Logger("Post Service");

	async findList() {}

	async findOne(findPostDto: FindPostDto) {
		const functionName = PostService.prototype.findOne.name;
		try {
			const {email, title, channelEmail} = findPostDto;
			const path = `${email}${title}${channelEmail}`;
			const id = generateId(path);
			const existedPost = await this.postModel.findByPk(id, {
				raw: true,
			});
			
			if (existedPost) 
				return existedPost;
			else {
				this.logger.error(`${functionName} : Post Does Not Exist`);
				return false;
			}
		} catch (error) {
			this.logger.error(`${error}`);
			throw new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(createPostDto: CreatePostDto, imgPath: string) {
		try {
			const { email, title, contents, channelEmail } = createPostDto;
			const path = `${email}${title}${channelEmail}`;
			const id = generateId(path);
			const value = {
				id: id,
				user_email: email,
				title: title,
				contents: contents,
				contents_image_path: imgPath,
				like_count: 0,
				view_count: 0,
				is_deleted: false,
				channelEmail: channelEmail
			};

			this.postModel.create(value);

			return true;
		} catch (error) {
			this.logger.error(`${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async update(updatePostDto: UpdatePostDto) {
		await this.delete(updatePostDto);
	}

	async delete(deletePostDto: DeletePostDto) {
		const functionName = PostService.prototype.delete.name;
		try {
			const existedPost = await this.postModel.findOne({
				where: {
					email: deletePostDto.email,
					title: deletePostDto.title,
					channelEmail: deletePostDto.channelEmail,
				},
			});

			if (existedPost) {
				await existedPost.destroy();
				return;
			}

			this.logger.error(`${functionName} : Post Does Not Exist`);
			return new HttpException(
				`${functionName} : Post Does Not Exist`,
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

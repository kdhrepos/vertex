import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post)
		private postModel: typeof Post,
	) {}

	private readonly logger = new Logger("Post Service");

	async findPostList() {}

	async findOnePost() {}

	async createPost(img: Express.Multer.File, createPostDto : CreatePostDto) {
		try {
			

			const {title, contents} = createPostDto;
			const value = {
				id : ,
				user_id : ,
				title: title,
				contents: contents,
				contents_image_path: ,
				like_count: 0,
				view_count: 0,
				is_deleted: false
			}

			this.postModel.create(value);

		} catch(error) {
			this.logger.error(`${error}`);
			throw new HttpException(
				`${error}`, 
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async updatePost() {}

	async deletePost() {}
}

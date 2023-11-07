import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "src/model/post.model";

@Injectable()
export class PostService {
	constructor(
		@InjectModel(Post)
		private postModel: typeof Post,
	) {}

	private readonly logger = new Logger("Post Service");

	async findList() {}

	async findOne() {}

	async create() {}

	async update() {}

	async delete() {}
}

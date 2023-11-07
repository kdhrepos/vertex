import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PostComment } from "src/model/post-comment.model";

@Injectable()
export class PostCommentService {
	constructor(
		@InjectModel(PostComment) private postCommentModel: typeof PostComment,
	) {}

	private readonly logger = new Logger("Post Comment Service");

	async findAll() {}

	async create() {}

	async update() {}

	async delete() {}
}

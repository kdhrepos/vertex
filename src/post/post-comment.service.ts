import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/model/commet.model";

@Injectable()
export class PostCommentService {
	constructor(@InjectModel(Comment) private commentModel: typeof Comment) {}

	private readonly logger = new Logger("Post Comment Service");

	async findAll() {}

	async create() {}

	async update() {}

	async delete() {}
}

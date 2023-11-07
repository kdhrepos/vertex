import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PostLike } from "src/model/post-like.model";

@Injectable()
export class PostLikeService {
	constructor(
		@InjectModel(PostLike)
		private postLikeModel: typeof PostLike,
	) {}

	private readonly logger = new Logger("Post Like Service");

	async put() {}
}

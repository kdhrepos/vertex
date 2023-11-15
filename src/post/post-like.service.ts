import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "src/model/like.model";

@Injectable()
export class PostLikeService {
	constructor(
		@InjectModel(Like)
		private likeModel: typeof Like,
	) {}

	private readonly logger = new Logger("Like Service");

	async put() {}
}

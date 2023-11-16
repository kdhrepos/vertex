import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "src/model/like.model";

@Injectable()
export class VideoLikeService {
	constructor(
		@InjectModel(Like)
		private likeModel: typeof Like,
	) {}

	private readonly logger = new Logger("Video Like Service");

	/**
	 * @description 비디오에 좋아요 버튼을 누름
	 */
	async put(userId: string, videoId: string) {}
}

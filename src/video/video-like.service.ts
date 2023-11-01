import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VideoLike } from "src/model/video-like.model";

@Injectable()
export class VideoLikeService {
	constructor(
		@InjectModel(VideoLike)
		private videoLikeModel: typeof VideoLike,
	) {}

	private readonly logger = new Logger("Video Like Service");

	/**
	 * @description 비디오에 좋아요 / 싫어요 버튼을 누름
	 */
	async put(userId: string, videoId: string) {}
}

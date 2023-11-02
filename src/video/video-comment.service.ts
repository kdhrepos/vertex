import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VideoComment } from "src/model/video-comment.model";

@Injectable()
export class VideoCommentService {
	constructor(
		@InjectModel(VideoComment)
		private videoCommentModel: typeof VideoComment,
	) {}

	private readonly logger = new Logger("Video Comment Service");

	/**
	 * @description 비디오 ID를 통해 비디오의 댓글들을 검색
	 */
	async findAll() {}

	async create() {}

	async update() {}

	async delete() {}
}

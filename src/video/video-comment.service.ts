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

	async findAll() {}

	async create() {}

	async update() {}

	async delete() {}
}

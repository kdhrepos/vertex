import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/model/commet.model";

@Injectable()
export class VideoCommentService {
	constructor(
		@InjectModel(Comment)
		private commentModel: typeof Comment,
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

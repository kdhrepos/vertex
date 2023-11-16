import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/model/commet.model";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { FindCommentDto } from "./dto/comment-dto/find-comment.dto";
import { User } from "src/model/user.model";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";

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
	async findAll(findCommentDto: FindCommentDto) {
		const functionName = VideoCommentService.prototype.findAll.name;
		try {
			const { path } = findCommentDto;

			return await this.commentModel.findAll({
				where: {
					contents_id: path,
				},
				include: [
					{
						model: User,
						attributes: ["name"],
					},
				],
				attributes: ["content", "createdAt"],
			});
		} catch (error) {
			this.logger.error(`${error}`);
			return new HttpException(
				`${functionName} ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(uploadCommentDto: UploadCommentDto) {
		const functionName = VideoCommentService.prototype.create.name;
		try {
			const { email, content, parentId, isVideo, path } = uploadCommentDto;

			await this.commentModel.create({
				user_email: email,
				contents_id: path,
				content: content,
				parent_id: parentId,
				is_video: isVideo,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async update(updateCommentDto: UpdateCommentDto) {
		const functionName = VideoCommentService.prototype.update.name;
		try {
			const { id, content, path } = updateCommentDto;

			await this.commentModel.update(
				{
					content: content,
				},
				{
					where: {
						id: id,
						contents_id: path,
					},
				},
			);
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async delete() {}
}

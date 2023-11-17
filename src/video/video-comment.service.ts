import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/model/comment.model";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { FindCommentDto } from "./dto/comment-dto/find-comment.dto";
import { User } from "src/model/user.model";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";

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
					video_id: path,
				},
				attributes: ["content", "createdAt", "parent_id"],
				include: [
					{
						model: User,
						attributes: ["name"],
					},
				],
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
			const { email, content, parentId, path } = uploadCommentDto;

			await this.commentModel.create({
				user_email: email,
				video_id: path,
				content: content,
				parent_id: parentId,
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
						video_id: path,
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

	async delete(deleteCommentDto: DeleteCommentDto) {
		const functionName = VideoCommentService.prototype.delete.name;
		try {
			const { id, email, path } = deleteCommentDto;

			const existedVideo = await this.commentModel.findOne({
				where: {
					id: id,
					user_email: email,
					video_id: path,
				},
			});

			if (!existedVideo) {
				this.logger.error(`${functionName} : Video Does Not Exist`);
				return new HttpException(
					`${functionName} : Video Does Not Exist`,
					HttpStatus.BAD_REQUEST,
				);
			}

			await existedVideo.destroy();
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			return new HttpException(
				`${functionName} : ${error}`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

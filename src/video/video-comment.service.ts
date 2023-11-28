import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/model/comment.model";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { User } from "src/model/user.model";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";

@Injectable()
export class VideoCommentService {
	constructor(
		@InjectModel(Comment)
		private commentModel: typeof Comment,
	) {}

	/**
	 * @description 비디오 ID를 통해 비디오의 댓글들을 검색
	 */
	async findAll(videoId: string) {
		try {
			const comments = await this.commentModel.findAll({
				where: {
					video_id: videoId,
				},
				attributes: ["id", "user_email", "content", "createdAt", "parent_id"],
				include: [
					{
						model: User,
						attributes: ["name"],
					},
				],
				order:[['createdAt','DESC']]
			});

			return {
				data: comments,
				statusCode: 200,
				message: "Video comments are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async create(uploadCommentDto: UploadCommentDto) {
		try {
			const { email, content, parentId, videoId } = uploadCommentDto;

			const comment = await this.commentModel.create({
				user_email: email,
				video_id: videoId,
				content: content,
				parent_id: parentId,
			});

			return {
				data: comment,
				statusCode: 200,
				message: "Video comment is successfully created",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async update(updateCommentDto: UpdateCommentDto) {
		try {
			const { id, content, videoId } = updateCommentDto;

			await this.commentModel.update(
				{
					content: content,
				},
				{
					where: {
						id: id,
						video_id: videoId,
					},
				},
			);

			return {
				statusCode: 200,
				message: "Video comment is successfully updated",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(deleteCommentDto: DeleteCommentDto) {
		try {
			const { id, videoId, email } = deleteCommentDto;

			const video = await this.commentModel.findOne({
				where: {
					id: id,
					user_email: email,
					video_id: videoId,
				},
			});

			if (!video) {
				await video.destroy();
				return {
					statusCode: 200,
					message: "Video comment is successfully deleted",
				};
			}

			return {
				statusCode: 400,
				message: "Video comment delete error",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

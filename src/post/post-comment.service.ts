import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/model/comment.model";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";
import { User } from "src/model/user.model";

@Injectable()
export class PostCommentService {
	constructor(@InjectModel(Comment) private commentModel: typeof Comment) {}

	async findAll(postId: string) {
		try {
			const comments = await this.commentModel.findAll({
				where: {
					post_id: postId,
				},
				attributes: ["id", "post_id", "createdAt", "updatedAt"],
				raw: true,
				include: [
					{
						model: User,
						as: "user",
						attributes: ["name"],
					},
				],
				order:[['createdAt','DESC']]
			});

			return {
				data: comments,
				statusCode: 200,
				message: "Comments are successfully found",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async create(uploadCommentDto: UploadCommentDto) {
		try {
			const { content, parentId, postId, email } = uploadCommentDto;

			await this.commentModel.create({
				user_email: email,
				post_id: postId,
				parent_id: parentId,
				content: content,
			});

			return {
				statusCode: 200,
				message: "Comment is successfully created",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async update(updateCommentDto: UpdateCommentDto) {
		try {
			const { commentId, content, postId, email } = updateCommentDto;

			await this.commentModel.update(
				{ content: content },
				{
					where: {
						id: commentId,
						post_id: postId,
						user_email: email,
					},
				},
			);

			return {
				statusCode: 200,
				message: "Comment is successfully updated",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(deleteCommentDto: DeleteCommentDto) {
		try {
			const { email, commentId, postId } = deleteCommentDto;

			await this.commentModel.destroy({
				where: {
					id: commentId,
					post_id: postId,
					user_email: email,
				},
			});

			return {
				statusCode: 200,
				message: "Comment is successfully deleted",
			};
		} catch (error) {
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

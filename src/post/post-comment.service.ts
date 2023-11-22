import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/model/comment.model";
import { UploadCommentDto } from "./dto/comment-dto/upload-comment.dto";
import { UpdateCommentDto } from "./dto/comment-dto/update-comment.dto";
import { DeleteCommentDto } from "./dto/comment-dto/delete-comment.dto";
import { User } from "src/model/user.model";

@Injectable()
export class PostCommentService {
	constructor(@InjectModel(Comment) private commentModel: typeof Comment) {}

	private readonly logger = new Logger("Post Comment Service");

	async findAll(postId: string) {
		const functionName = PostCommentService.prototype.findAll.name;
		try {
			return await this.commentModel.findAll({
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
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async create(uploadCommentDto: UploadCommentDto, session: any) {
		const functionName = PostCommentService.prototype.create.name;
		try {
			const { content, parentId, postId } = uploadCommentDto;
			const { user: email } = session.passport;

			await this.commentModel.create({
				user_email: email,
				post_id: postId,
				parent_id: parentId,
				content: content,
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async update(updateCommentDto: UpdateCommentDto, session: any) {
		const functionName = PostCommentService.prototype.update.name;
		try {
			const { commentId, content, postId } = updateCommentDto;
			const { user: email } = session.passport;

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
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(deleteCommentDto: DeleteCommentDto, session: any) {
		const functionName = PostCommentService.prototype.delete.name;
		try {
			const { commentId, postId } = deleteCommentDto;
			const { user: email } = session.passport;

			await this.commentModel.destroy({
				where: {
					id: commentId,
					post_id: postId,
					user_email: email,
				},
			});
		} catch (error) {
			this.logger.error(`${functionName} : ${error}`);
			throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

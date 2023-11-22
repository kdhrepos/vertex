import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
	HasMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Video } from "./video.model";
import { Post } from "./post.model";

@Table({ freezeTableName: true, initialAutoIncrement: "1" })
export class Comment extends Model {
	// Columns
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@ForeignKey(() => User)
	@Column({})
	user_email: string;

	@ForeignKey(() => Video)
	@Column({ allowNull: true, onDelete: "CASCADE" })
	video_id: string;

	@ForeignKey(() => Post)
	@Column({ allowNull: true, onDelete: "CASCADE" })
	post_id: number;

	@ForeignKey(() => Comment)
	@Column({
		allowNull: true,
		onDelete: "CASCADE",
	})
	parent_id: number;

	@Column
	content: string;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsTo(() => Video, "video_id")
	video: Video;

	@BelongsTo(() => Post, "post_id")
	post: Post;

	@BelongsTo(() => Comment, "parent_id")
	parent: Comment;
}

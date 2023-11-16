import { UUID } from "crypto";
import {
	Table,
	Column,
	Model,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Video } from "./video.model";
import { Post } from "./post.model";

@Table({ freezeTableName: true })
export class Like extends Model {
	// Columns
	@ForeignKey(() => User)
	@Column({ primaryKey: true, onDelete: "CASCADE" })
	user_email: string;

	@ForeignKey(() => Post)
	@ForeignKey(() => Video)
	@Column({ primaryKey: true, onDelete: "CASCADE" })
	contents_id: string;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsTo(() => Post, "contents_id")
	post: Post;

	@BelongsTo(() => Video, "contents_id")
	video: Video;
	/* Has */
}

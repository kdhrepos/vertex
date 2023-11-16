import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
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
	@Column({
		primaryKey: true,
	})
	user_email: string;

	// @ForeignKey(() => Video || Post)
	@Column({
		primaryKey: true,
	})
	contents_id: string;

	// @ForeignKey(() => Comment)
	@Column({
		allowNull: true,
	})
	parent_id: number;

	@Column
	content: string;

	@Column
	is_video: number;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User;

	/* Has */
}

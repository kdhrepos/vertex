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

@Table({ freezeTableName: true })
export class Comment extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: number;

	@ForeignKey(() => User)
	@Column({
		primaryKey: true,
	})
	user_email: string;

	@ForeignKey(() => Video || Post)
	@Column({
		primaryKey: true,
	})
	contents_id: string;

	@ForeignKey(() => Comment)
	@Column({
		allowNull: true,
		references: {
			model: Comment,
			key: "id",
		},
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

	/* Has */
}

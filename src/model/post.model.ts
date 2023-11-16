import { UUID } from "crypto";
import {
	Table,
	Column,
	Model,
	BelongsTo,
	ForeignKey,
	HasMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Like } from "./like.model";
import { Comment } from "./comment.model";

@Table({ freezeTableName: true })
export class Post extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: UUID;

	@ForeignKey(() => User)
	@Column({})
	user_email: string;

	@Column
	title: string;

	@Column
	contents: string;

	@Column({ allowNull: true })
	contents_image_path: string;

	@Column({ defaultValue: 0 })
	like_count: number;

	@Column({ defaultValue: 0 })
	view_count: number;

	@Column({ defaultValue: false })
	is_deleted: boolean;

	@ForeignKey(() => User)
	@Column
	channel_email: string;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsTo(() => User, "channel_email")
	channel: User;

	/* Has */
	@HasMany(() => Like)
	likes: Like[];

	@HasMany(() => Comment)
	comments: Comment[];
}

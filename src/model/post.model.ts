import { UUID } from "crypto";
import {
	Table,
	Column,
	Model,
	BelongsTo,
	ForeignKey,
	HasMany,
	BelongsToMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Like } from "./like.model";
import { Comment } from "./comment.model";
import { Hashtag } from "./hashtag.model";
import { HashtagLink } from "./hashtagLink.model";

@Table({ freezeTableName: true })
export class Post extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: UUID;

	@ForeignKey(() => User)
	@Column({ onDelete: "CASCADE" })
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

	@BelongsToMany(() => Hashtag, () => HashtagLink, "id", "id")
	hashtagLink: HashtagLink;

	/* Has */
	@HasMany(() => Like)
	likes: Like[];

	@HasMany(() => Comment)
	comments: Comment[];
}

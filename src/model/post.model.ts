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
import { Hashtag } from "./hashtag.model";
import { HashtagLink } from "./hashtagLink.model";
import { Like } from "./like.model";

@Table({ freezeTableName: true, initialAutoIncrement: "1" })
export class Post extends Model {
	// Columns
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@ForeignKey(() => User)
	@Column({ onDelete: "CASCADE" })
	user_email: string;

	@ForeignKey(() => User)
	@Column({ onDelete: "CASCADE" })
	channel_email: string;

	@Column
	title: string;

	@Column
	contents: string;

	@Column({ allowNull: true })
	image_file_path: string;

	@Column({ defaultValue: 0 })
	like_count: number;

	@Column({ defaultValue: 0 })
	view_count: number;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsTo(() => User, "channel_email")
	channel: User;

	@BelongsToMany(() => Hashtag, () => HashtagLink, "post_id")
	hashtagLink: HashtagLink;
}

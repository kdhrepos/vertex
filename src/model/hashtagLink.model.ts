import {
	Table,
	Column,
	Model,
	BelongsTo,
	BelongsToMany,
	ForeignKey,
} from "sequelize-typescript";
import { Video } from "./video.model";
import { Post } from "./post.model";
import { Hashtag } from "./hashtag.model";

@Table({ freezeTableName: true, initialAutoIncrement: "1" })
export class HashtagLink extends Model {
	// Columns;

	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@ForeignKey(() => Video)
	@Column({ unique: true, allowNull: true, onDelete: "CASCADE" })
	video_id: string;

	@ForeignKey(() => Post)
	@Column({ unique: true, allowNull: true, onDelete: "CASCADE" })
	post_id: string;

	@ForeignKey(() => Hashtag)
	@Column({ unique: true, allowNull: false, onDelete: "CASCADE" })
	hashtag_id: number;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => Post, "contents_id")
	post: Post;

	@BelongsTo(() => Video, "contents_id")
	video: Video;
	/* Has */
}

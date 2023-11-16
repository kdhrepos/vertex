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

@Table({ freezeTableName: true })
export class HashtagLink extends Model {
	// Columns;

	@ForeignKey(() => Video)
	@ForeignKey(() => Post)
	@Column({ primaryKey: true })
	contents_id: string;

	@ForeignKey(() => Hashtag)
	@Column({ primaryKey: true })
	hashtag_id: number;

	@Column
	is_video: boolean;

	/**
	 * Relationship
	 */

	/* Belongs */
	// @BelongsTo(() => Post, "contents_id")
	// post: Post;

	// @BelongsTo(() => Video, "contents_id")
	// video: Video;
	/* Has */
}

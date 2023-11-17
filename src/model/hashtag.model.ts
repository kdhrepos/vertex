import { Table, Column, Model, BelongsToMany } from "sequelize-typescript";
import { Video } from "./video.model";
import { Post } from "./post.model";
import { HashtagLink } from "./hashtagLink.model";

@Table({ freezeTableName: true, initialAutoIncrement: "1" })
export class Hashtag extends Model {
	// Columns
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column
	name: string;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsToMany(() => Video, () => HashtagLink, "hashtag_id")
	videoLink: HashtagLink;

	@BelongsToMany(() => Post, () => HashtagLink, "hashtag_id")
	postLink: HashtagLink;
	/* Has */
}

import { Table, Column, Model, BelongsToMany } from "sequelize-typescript";
import { Video } from "./video.model";
import { HashtagLink } from "./hashtagLink.model";
import { Post } from "./post.model";

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
	@BelongsToMany(() => Video, () => HashtagLink, "id", "file_path")
	videoLink: HashtagLink;

	@BelongsToMany(() => Post, () => HashtagLink, "id", "id")
	postLink: HashtagLink;
	/* Has */
}

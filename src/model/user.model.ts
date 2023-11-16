import { Table, Column, Model, IsEmail, HasMany } from "sequelize-typescript";
import { Video } from "./video.model";
import { VideoRecord } from "./video-record.model";
import { Post } from "./post.model";
import { Playlist } from "./playlist.model";
import { Like } from "./like.model";
import { Comment } from "./commet.model";

@Table({ freezeTableName: true })
export class User extends Model {
	@IsEmail
	@Column({ primaryKey: true })
	email: string;

	// Columns
	@Column({ allowNull: true })
	provider_id: string;

	@Column({ allowNull: true })
	password: string;

	@Column
	name: string;

	@Column({ allowNull: true })
	profile_image_path: string;

	@Column({ allowNull: true })
	description: string;

	/**
	 * Relationship
	 */

	/* Belongs */

	/* Has */
	@HasMany(() => Comment)
	comments: Comment[];
}

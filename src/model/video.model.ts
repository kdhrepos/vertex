import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
	HasMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Comment } from "./commet.model";
import { HashtagLink } from "./hashtagLink.model";
import { VideoRecord } from "./video-record.model";
import { Like } from "./like.model";

/*
	트리거 참조
    What should happen when the referenced key is deleted. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
    NO ACTION
   
  	onDelete?: string;
*/
@Table({ freezeTableName: true })
export class Video extends Model {
	// Columns
	@Column
	file_path: string;

	@Column({ primaryKey: true })
	user_email: string;

	@Column({ primaryKey: true })
	title: string;

	@Column({ allowNull: true })
	description: string;

	@Column({ defaultValue: 0 })
	like_count: number;

	@Column({ defaultValue: 0 })
	view_count: number;

	@Column
	video_file_extension: string;

	@Column
	thumbnail_file_extension: string;

	/**
	 * Relationship
	 */

	/* Belongs */

	/* Has */
}

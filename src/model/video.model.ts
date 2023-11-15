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
	@Column({ primaryKey: true })
	video_path: string;

	@ForeignKey(() => User)
	@Column({})
	user_email: string;

	@Column({ allowNull: false })
	thumbnail_path: string;

	@Column
	title: string;

	@Column({ allowNull: true })
	description: string;

	@Column({ defaultValue: 0 })
	like_count: number;

	@Column({ defaultValue: 0 })
	view_count: number;

	@Column({ defaultValue: false })
	is_deleted: boolean;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User;

	/* Has */
	// @HasMany(() => Comment, "id")
	// comment: Comment[];

	// @HasMany(() => HashtagLink)
	// hashtagLink: HashtagLink[];

	@HasMany(() => VideoRecord, "video_id" && "user_email")
	videoRecord: VideoRecord[];

	@HasMany(() => Like, "user_email" && "contents_id")
	likes: Like[];
}

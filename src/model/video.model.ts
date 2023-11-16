import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
	HasMany,
	BelongsToMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { Comment } from "./comment.model";
import { HashtagLink } from "./hashtagLink.model";
import { Record } from "./record.model";
import { Like } from "./like.model";
import { PlaylistContents } from "./playlist-contents.model";
import { Playlist } from "./playlist.model";

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
	file_path: string;

	@ForeignKey(() => User)
	@Column
	user_email: string;

	@Column
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
	@BelongsTo(() => User)
	user: User;

	@BelongsToMany(() => Playlist, () => PlaylistContents, "file_path", "id")
	playlistContents: PlaylistContents;

	/* Has */
	@HasMany(() => Like)
	likes: Like[];

	@HasMany(() => Comment)
	comments: Comment[];

	@HasMany(() => HashtagLink)
	hashtagLinks: HashtagLink[];

	@HasMany(() => Record)
	records: Record[];
}

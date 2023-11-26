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
import { Record } from "./record.model";
import { PlaylistContents } from "./playlist-contents.model";
import { Playlist } from "./playlist.model";
import { Hashtag } from "./hashtag.model";
import { Like } from "./like.model";
import { HashtagLink } from "./hashtagLink.model";

/*
	트리거 참조
    What should happen when the referenced key is deleted. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
    NO ACTION
   
  	onDelete?: string;
*/
@Table({ freezeTableName: true })
export class Video extends Model {
	// Columns
	// 비디오 id가 파이어 베이스 내 경로
	@Column({ primaryKey: true })
	id: string;

	@ForeignKey(() => User)
	@Column({ onDelete: "CASCADE" })
	user_email: string;

	@Column
	title: string;

	@Column
	name: string;
	
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
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsToMany(() => Playlist, () => PlaylistContents, "video_id")
	playlistContents: PlaylistContents;

	@BelongsToMany(() => Hashtag, () => HashtagLink, "video_id")
	hashtagLink: HashtagLink;

	@BelongsToMany(() => User, () => Like, "video_id")
	like: Like;

	@BelongsToMany(() => User, () => Record, "video_id")
	record: Record;
}

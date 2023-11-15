import { Table, Column, Model, IsEmail, HasMany } from "sequelize-typescript";
import { Video } from "./video.model";
import { VideoRecord } from "./video-record.model";
import { Post } from "./post.model";
import { Playlist } from "./playlist.model";
import { Like } from "./like.model";

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

	// Relationship
	@HasMany(() => Video, "video_path")
	videos: Video[];

	@HasMany(() => VideoRecord, "video_id" && "user_email")
	videoRecords: VideoRecord[];

	@HasMany(() => Post, "post_id")
	posts: Post[];

	@HasMany(() => Playlist, "id")
	playlists: Playlist[];

	@HasMany(() => Like, "user_email" && "contents_id")
	likes: Like[];
}

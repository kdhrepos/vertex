import { Table, Column, Model, BelongsTo, HasMany } from "sequelize-typescript";
import { User } from "./user.model";
import { PlaylistContents } from "./playlist-contents.model";

@Table({ freezeTableName: true })
export class Playlist extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: number;

	@Column({
		references: {
			model: User,
			key: "email",
		},
	})
	user_email: string;

	@Column
	list_name: string;

	// Relationship
	@BelongsTo(() => User, "user_email")
	user: User;

	@HasMany(() => PlaylistContents, "video_id" && "playlist_id")
	playlistContents: PlaylistContents[];
}

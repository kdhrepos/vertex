import {
	Table,
	Column,
	Model,
	BelongsTo,
	HasMany,
	ForeignKey,
	BelongsToMany,
} from "sequelize-typescript";
import { User } from "./user.model";
import { PlaylistContents } from "./playlist-contents.model";
import { Video } from "./video.model";

@Table({ freezeTableName: true, initialAutoIncrement: "1" })
export class Playlist extends Model {
	// Columns
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@ForeignKey(() => User)
	@Column({ onDelete: "CASCADE" })
	user_email: string;

	@Column
	list_name: string;

	/**
	 * Relationship
	 */

	/* Belongs */
	@BelongsTo(() => User, "user_email")
	user: User;

	@BelongsToMany(() => Video, () => PlaylistContents, "playlist_id")
	playlistContents: PlaylistContents;

	/* Has */
}

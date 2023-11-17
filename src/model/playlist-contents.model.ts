import { UUID } from "crypto";
import {
	Table,
	Column,
	Model,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";
import { Playlist } from "./playlist.model";
import { Video } from "./video.model";

@Table({ freezeTableName: true })
export class PlaylistContents extends Model {
	// Columns
	@ForeignKey(() => Video)
	@Column({ primaryKey: true, onDelete: "CASCADE" })
	video_id: string;

	@ForeignKey(() => Playlist)
	@Column({ primaryKey: true, onDelete: "CASCADE" })
	playlist_id: number;

	/**
	 * Relationship
	 */

	/* Belongs */
	/* Has */
}

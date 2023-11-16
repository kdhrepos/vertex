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
	@Column({ primaryKey: true })
	video_id: string;

	@Column({ primaryKey: true })
	playlist_id: number;

	/**
	 * Relationship
	 */

	/* Belongs */
	/* Has */
}

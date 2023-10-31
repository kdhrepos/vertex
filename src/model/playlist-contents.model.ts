import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class PlaylistContents extends Model {
	// Columns
	@Column({ primaryKey: true })
	video_id: UUID;

	@Column
	playlist_id: UUID;

	// Relationship
}

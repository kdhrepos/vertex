import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class VideoRecord extends Model {
	// Columns
	@Column({ primaryKey: true })
	user_id: UUID;

	@Column
	video_id: UUID;

	// Relationship
}

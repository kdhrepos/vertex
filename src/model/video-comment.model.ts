import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class VideoComment extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: number;

	@Column
	video_id: UUID;

	@Column
	user_id: UUID;

	@Column({ allowNull: true })
	parent_id: UUID;

	@Column
	content: string;

	//Relationship
}

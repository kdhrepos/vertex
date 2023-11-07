import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class VideoComment extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: number;

	@Column({ unique: true })
	video_id: UUID;

	@Column({ unique: true })
	user_id: UUID;

	@Column({ allowNull: true })
	parent_id: number;

	@Column
	content: string;

	//Relationship
}

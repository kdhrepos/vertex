import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class PostLike extends Model {
	// Columns
	@Column({ primaryKey: true })
	user_id: UUID;

	@Column({ primaryKey: true })
	video_id: UUID;
}

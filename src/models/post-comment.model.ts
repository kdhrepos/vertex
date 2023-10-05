import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class PostComment extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: UUID;

	@Column
	post_id: UUID;

	@Column
	content: string;

	// Relationship
}

import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class Playlist extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: number;

	@Column
	user_id: UUID;

	@Column
	list_name: string;

	// Relationship
}

import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class Hashtag extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: UUID;

	@Column
	name: string;

	// Relationship
}

import { UUID } from "crypto";
import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class HashtagLink extends Model {
	// Columns
	// @Column({ primaryKey: true })
	// contents_id: UUID;

	// @Column({ primaryKey: true })
	// hashtag_id: number;

	@Column
	is_video: boolean;

	// Relationship
}

import { UUID } from "crypto";
import { Table, Column, Model } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class Post extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: UUID;

	@Column
	user_id: UUID;

	@Column
	title: string;

	@Column
	contents: string;

	@Column
	contents_image_path: string;

	@Column({ defaultValue: 0 })
	like_count: number;

	@Column({ defaultValue: 0 })
	view_count: number;

	@Column({ defaultValue: false })
	is_deleted: boolean;

	// Relationship
}

import { UUID } from "crypto";
import { Table, Column, Model, BelongsTo } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ freezeTableName: true })
export class Post extends Model {
	// Columns
	@Column({ primaryKey: true })
	id: UUID;

	@Column({})
	user_email: string;

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

	/**
	 * Relationship
	 */

	/* Belongs */

	/* Has */
}

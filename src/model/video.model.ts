import { UUID } from "crypto";
import { Table, Column, Model, ForeignKey } from "sequelize-typescript";

/*
	트리거 참조
    What should happen when the referenced key is deleted. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
    NO ACTION
   
  	onDelete?: string;
*/
@Table({ freezeTableName: true })
export class Video extends Model {
	// Columns
	@Column({ primaryKey: true })
	video_path: string;

	@Column
	user_email: string;

	@Column({ allowNull: false })
	thumbnail_path: string;

	@Column
	title: string;

	@Column({ allowNull: true })
	description: string;

	@Column({ defaultValue: 0 })
	like_count: number;

	@Column({ defaultValue: 0 })
	view_count: number;

	@Column({ defaultValue: false })
	is_deleted: boolean;

	// Relationship
}
